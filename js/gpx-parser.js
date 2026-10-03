/**
 * GPX Parser & Geospatial Math for RaceMap Decorator
 * Parses GPX XML, computes distance, elevations, paces, bounding box,
 * and handles Web Mercator projections.
 */

class GPXParser {
  /**
   * Parse a raw GPX XML string into structured race data
   * @param {string} gpxText
   * @returns {Object} Parsed track data
   */
  static parse(gpxText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxText, 'application/xml');
    
    // Check for parse error
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid GPX XML format: ' + parserError.textContent);
    }

    // Extract race name from metadata or trk
    let raceName = 'My Run';
    const nameEl = xmlDoc.querySelector('metadata > name') || xmlDoc.querySelector('trk > name');
    if (nameEl && nameEl.textContent.trim()) {
      raceName = nameEl.textContent.trim();
    }

    // Extract track points - namespace-agnostic (supports trkpt, rtept, gpx:trkpt)
    let trkpts = Array.from(xmlDoc.getElementsByTagName('trkpt'));
    if (trkpts.length === 0) {
      trkpts = Array.from(xmlDoc.getElementsByTagName('rtept'));
    }
    if (trkpts.length === 0) {
      trkpts = Array.from(xmlDoc.querySelectorAll('trkpt, rtept, [lat][lon]'));
    }

    const parseCoordinate = (val) => {
      if (!val) return NaN;
      // Handle comma as decimal separator (e.g. in some European smartwatch exports)
      return parseFloat(val.replace(',', '.'));
    };

    const points = [];
    
    trkpts.forEach((pt, index) => {
      const latStr = pt.getAttribute('lat') || pt.getAttribute('latitude');
      const lonStr = pt.getAttribute('lon') || pt.getAttribute('longitude') || pt.getAttribute('long');
      
      const lat = parseCoordinate(latStr);
      const lon = parseCoordinate(lonStr);
      
      const eleEl = pt.getElementsByTagName('ele')[0] || pt.querySelector('ele');
      const timeEl = pt.getElementsByTagName('time')[0] || pt.querySelector('time');
      
      const ele = eleEl ? parseCoordinate(eleEl.textContent) : 0;
      const time = timeEl ? new Date(timeEl.textContent) : null;
      
      if (!isNaN(lat) && !isNaN(lon)) {
        points.push({
          lat,
          lon,
          ele: isNaN(ele) ? 0 : ele,
          time,
          index
        });
      }
    });

    if (points.length < 2) {
      throw new Error('GPX file contains fewer than 2 valid track points.');
    }

    // Extract waypoints (predefined POIs in GPX)
    let wpts = Array.from(xmlDoc.getElementsByTagName('wpt'));
    if (wpts.length === 0) {
      wpts = Array.from(xmlDoc.querySelectorAll('wpt'));
    }
    const waypoints = [];
    wpts.forEach((wpt, index) => {
      const lat = parseCoordinate(wpt.getAttribute('lat') || wpt.getAttribute('latitude'));
      const lon = parseCoordinate(wpt.getAttribute('lon') || wpt.getAttribute('longitude') || wpt.getAttribute('long'));
      const nameEl = wpt.getElementsByTagName('name')[0] || wpt.querySelector('name');
      const descEl = wpt.getElementsByTagName('desc')[0] || wpt.querySelector('desc');
      const symEl = wpt.getElementsByTagName('sym')[0] || wpt.querySelector('sym');

      const name = nameEl?.textContent?.trim() || `Point ${index + 1}`;
      const desc = descEl?.textContent?.trim() || '';
      const sym = symEl?.textContent?.trim() || 'landmark';
      
      if (!isNaN(lat) && !isNaN(lon)) {
        waypoints.push({
          id: 'wpt_' + index + '_' + Date.now(),
          lat,
          lon,
          name,
          desc,
          icon: this.mapSymbolToIcon(sym),
          isCustom: false,
          active: true
        });
      }
    });

    // Compute cumulative distances, bounds, elevation metrics
    let totalDistKm = 0;
    let minLat = points[0].lat;
    let maxLat = points[0].lat;
    let minLon = points[0].lon;
    let maxLon = points[0].lon;
    let minEle = points[0].ele;
    let maxEle = points[0].ele;
    let totalEleGain = 0;

    points[0].distFromStartKm = 0;

    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      
      const d = this.haversineDistanceKm(p1.lat, p1.lon, p2.lat, p2.lon);
      totalDistKm += d;
      p2.distFromStartKm = totalDistKm;

      if (p2.lat < minLat) minLat = p2.lat;
      if (p2.lat > maxLat) maxLat = p2.lat;
      if (p2.lon < minLon) minLon = p2.lon;
      if (p2.lon > maxLon) maxLon = p2.lon;

      if (p2.ele < minEle) minEle = p2.ele;
      if (p2.ele > maxEle) maxEle = p2.ele;

      const eleDiff = p2.ele - p1.ele;
      if (eleDiff > 0) {
        totalEleGain += eleDiff;
      }
    }

    // Time calculations
    let totalDurationSec = 0;
    let startTime = points[0].time;
    let endTime = points[points.length - 1].time;
    
    if (startTime && endTime) {
      totalDurationSec = Math.max(0, Math.round((endTime.getTime() - startTime.getTime()) / 1000));
    } else {
      // Estimate realistic marathon time based on 5:00 /km pace if timestamps are missing
      totalDurationSec = Math.round(totalDistKm * 300);
      startTime = new Date();
      endTime = new Date(startTime.getTime() + totalDurationSec * 1000);
    }

    // Pace calculation (min/km and min/mile)
    const paceSecPerKm = totalDistKm > 0 ? totalDurationSec / totalDistKm : 0;
    const paceSecPerMile = totalDistKm > 0 ? (totalDurationSec / (totalDistKm * 0.621371)) : 0;

    // Associate waypoints with nearest track point distance
    waypoints.forEach(wp => {
      const nearest = this.findNearestTrackPoint(wp.lat, wp.lon, points);
      wp.distFromStartKm = nearest.distKm;
      wp.distFromStartMile = nearest.distKm * 0.621371;
      wp.routeLat = nearest.point.lat;
      wp.routeLon = nearest.point.lon;
    });

    // Generate automatic mile and kilometer markers
    const kmSplits = this.generateSplits(points, 1.0, totalDistKm);
    const mileSplits = this.generateSplits(points, 1.60934, totalDistKm);

    return {
      name: raceName,
      points,
      waypoints,
      stats: {
        distanceKm: totalDistKm,
        distanceMiles: totalDistKm * 0.621371,
        durationSec: totalDurationSec,
        durationFormatted: this.formatDuration(totalDurationSec),
        paceKmFormatted: this.formatPace(paceSecPerKm),
        paceMileFormatted: this.formatPace(paceSecPerMile),
        elevationGainM: Math.round(totalEleGain),
        elevationGainFt: Math.round(totalEleGain * 3.28084),
        minElevationM: Math.round(minEle),
        maxElevationM: Math.round(maxEle),
        startTime: startTime ? startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Race Day'
      },
      bounds: {
        minLat,
        maxLat,
        minLon,
        maxLon,
        centerLat: (minLat + maxLat) / 2,
        centerLon: (minLon + maxLon) / 2
      },
      kmSplits,
      mileSplits
    };
  }

  /**
   * Great Circle Haversine formula (km)
   */
  static haversineDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Find nearest point on track to a given coordinate
   */
  static findNearestTrackPoint(lat, lon, points) {
    let minDist = Infinity;
    let nearestPoint = points[0];
    
    for (let i = 0; i < points.length; i++) {
      const d = this.haversineDistanceKm(lat, lon, points[i].lat, points[i].lon);
      if (d < minDist) {
        minDist = d;
        nearestPoint = points[i];
      }
    }
    
    return {
      point: nearestPoint,
      distKm: nearestPoint.distFromStartKm,
      offsetKm: minDist
    };
  }

  /**
   * Generate split markers at regular intervals
   */
  static generateSplits(points, intervalKm, totalDistKm) {
    const splits = [];
    let nextTarget = intervalKm;
    let splitNumber = 1;

    for (let i = 1; i < points.length; i++) {
      const pPrev = points[i - 1];
      const pCurr = points[i];

      if (pCurr.distFromStartKm >= nextTarget && nextTarget <= totalDistKm) {
        // Linear interpolation to exact target point
        const fraction = (nextTarget - pPrev.distFromStartKm) / (pCurr.distFromStartKm - pPrev.distFromStartKm || 1);
        const lat = pPrev.lat + (pCurr.lat - pPrev.lat) * fraction;
        const lon = pPrev.lon + (pCurr.lon - pPrev.lon) * fraction;

        splits.push({
          number: splitNumber,
          distKm: nextTarget,
          lat,
          lon
        });

        splitNumber++;
        nextTarget += intervalKm;
      }
    }
    return splits;
  }

  static formatDuration(totalSec) {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    
    const pad = (n) => String(n).padStart(2, '0');
    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
  }

  static formatPace(secPerUnit) {
    if (!secPerUnit || !isFinite(secPerUnit)) return '0:00';
    const minutes = Math.floor(secPerUnit / 60);
    const seconds = Math.floor(secPerUnit % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  static mapSymbolToIcon(sym) {
    const s = (sym || '').toLowerCase();
    if (s.includes('bridge')) return 'bridge';
    if (s.includes('start')) return 'flag_start';
    if (s.includes('finish')) return 'flag_finish';
    if (s.includes('hill') || s.includes('mountain')) return 'mountain';
    if (s.includes('cheer') || s.includes('party')) return 'cheer';
    if (s.includes('beer') || s.includes('drink')) return 'beer';
    if (s.includes('water') || s.includes('fuel')) return 'water';
    if (s.includes('camera') || s.includes('photo')) return 'camera';
    if (s.includes('castle') || s.includes('tower')) return 'castle';
    if (s.includes('trophy') || s.includes('medal')) return 'trophy';
    if (s.includes('park') || s.includes('tree')) return 'park';
    if (s.includes('clock') || s.includes('bell')) return 'clock';
    if (s.includes('heart') || s.includes('love')) return 'heart';
    return 'landmark';
  }
}

// Make accessible globally
window.GPXParser = GPXParser;
