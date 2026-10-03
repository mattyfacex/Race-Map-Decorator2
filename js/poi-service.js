/**
 * POI Service - Landmark discovery, icon registry, and landmark state management
 */

class POIService {
  constructor() {
    this.landmarks = [];
    this.activeLandmarkId = null;
    this.listeners = [];
  }

  // Complete SVG Icon Catalog for Landmark Badges
  static ICONS = {
    landmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2L2 7h20L12 2z"/></svg>`,
    bridge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19h18M3 14c4-7 14-7 18 0M7 14v5M17 14v5M12 11v8"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    mountain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`,
    flag_start: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
    flag_finish: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    cheer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M20 13h.01M12 6h.01M17 17h.01"/></svg>`,
    water: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    beer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>`,
    castle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"/><path d="M18 11V4H6v7"/><path d="M15 22v-4a3 3 0 0 0-6 0v4"/><path d="M22 11V9"/><path d="M2 11V9"/><path d="M6 4V2"/><path d="M18 4V2"/><path d="M10 4V2"/><path d="M14 4V2"/></svg>`,
    trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    park: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7l-3.3-4.4a1 1 0 0 0-1.4 0L9 7.3a1 1 0 0 0 .8 1.7H10l-3 3.3a1 1 0 0 0 .7 1.7H9l-3 3.3a1 1 0 0 0 .7 1.7H12Z"/></svg>`,
    ship: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M12 10V4"/><path d="m12 4 4 2"/><path d="m12 7 4 2"/></svg>`,
    buildings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>`,
    music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    crown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`
  };

  /**
   * Set initial landmarks (from parsed GPX waypoints or defaults)
   */
  setLandmarks(landmarks) {
    this.landmarks = landmarks.map((lm, idx) => ({
      ...lm,
      id: lm.id || 'lm_' + idx + '_' + Math.random().toString(36).substr(2, 6),
      active: lm.active !== undefined ? lm.active : true,
      icon: lm.icon || 'landmark',
      // Manual callout offset displacement in canvas space (dx, dy)
      offsetDx: lm.offsetDx || 0,
      offsetDy: lm.offsetDy || 0,
      badgeAnchor: lm.badgeAnchor || 'auto' // 'auto', 'top-right', 'top-left', 'bottom-right', 'bottom-left'
    }));
    this.notify();
  }

  getLandmarks() {
    return this.landmarks;
  }

  getActiveLandmarks() {
    return this.landmarks.filter(l => l.active);
  }

  toggleLandmark(id) {
    const item = this.landmarks.find(l => l.id === id);
    if (item) {
      item.active = !item.active;
      this.notify();
    }
  }

  updateLandmark(id, updates) {
    const item = this.landmarks.find(l => l.id === id);
    if (item) {
      Object.assign(item, updates);
      this.notify();
    }
  }

  removeLandmark(id) {
    this.landmarks = this.landmarks.filter(l => l.id !== id);
    this.notify();
  }

  addCustomLandmark(lat, lon, name = 'Landmark Point', icon = 'landmark', points = []) {
    let nearestDistKm = 0;
    if (points && points.length > 0) {
      const nearest = GPXParser.findNearestTrackPoint(lat, lon, points);
      nearestDistKm = nearest.distKm;
    }

    const newLandmark = {
      id: 'custom_' + Date.now(),
      lat,
      lon,
      routeLat: lat,
      routeLon: lon,
      name,
      icon,
      distFromStartKm: nearestDistKm,
      distFromStartMile: nearestDistKm * 0.621371,
      active: true,
      isCustom: true,
      offsetDx: 0,
      offsetDy: 0
    };

    this.landmarks.push(newLandmark);
    this.notify();
    return newLandmark;
  }

  /**
   * Helper to deduce the best matching SVG icon from name, type, and tags
   */
  static deduceIcon(name = '', type = '', tags = {}) {
    const s = `${name} ${type} ${tags.tourism || ''} ${tags.historic || ''} ${tags.man_made || ''}`.toLowerCase();
    if (s.includes('obelisc') || s.includes('obelisk') || s.includes('monument') || s.includes('statue') || s.includes('memorial')) return 'landmark';
    if (s.includes('bridge') || s.includes('puente') || s.includes('pont') || s.includes('brücke')) return 'bridge';
    if (s.includes('tower') || s.includes('torre') || s.includes('clock') || s.includes('campanile')) return 'clock';
    if (s.includes('palace') || s.includes('castle') || s.includes('cathedral') || s.includes('catedral') || s.includes('iglesia') || s.includes('basilica') || s.includes('temple') || s.includes('casa rosada')) return 'castle';
    if (s.includes('park') || s.includes('parque') || s.includes('garden') || s.includes('jardin') || s.includes('plaza')) return 'park';
    if (s.includes('hill') || s.includes('mountain') || s.includes('mont') || s.includes('cerro') || s.includes('colina')) return 'mountain';
    if (s.includes('stadium') || s.includes('arena') || s.includes('estadio') || s.includes('cancha') || s.includes('bombonera')) return 'trophy';
    if (s.includes('water') || s.includes('river') || s.includes('rio') || s.includes('lake') || s.includes('darsena') || s.includes('puerto') || s.includes('bay')) return 'water';
    if (s.includes('viewpoint') || s.includes('mirador') || s.includes('camera') || s.includes('photo')) return 'camera';
    if (s.includes('cheer') || s.includes('party')) return 'cheer';
    if (s.includes('beer') || s.includes('pub') || s.includes('bar')) return 'beer';
    return 'landmark';
  }

  /**
   * Search any landmark worldwide using OpenStreetMap Nominatim API,
   * biased to the race's geographic bounding box, and snap to the runner's course line.
   */
  async searchNominatim(query, bounds, points) {
    if (!query || query.trim().length < 2) return [];

    const { minLat, maxLat, minLon, maxLon } = bounds || { minLat: -90, maxLat: 90, minLon: -180, maxLon: 180 };
    // Bounding box buffer for search bias
    const south = Math.max(-90, minLat - 0.15);
    const north = Math.min(90, maxLat + 0.15);
    const west = Math.max(-180, minLon - 0.15);
    const east = Math.min(180, maxLon + 0.15);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&viewbox=${west},${north},${east},${south}&bounded=0&limit=6&addressdetails=1`;

    try {
      const resp = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!resp.ok) {
        throw new Error(`Nominatim HTTP ${resp.status}`);
      }

      const results = await resp.json();
      if (!results || results.length === 0) return [];

      return results.map(item => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        
        // Find nearest point on runner route
        const nearest = points && points.length > 0 ? GPXParser.findNearestTrackPoint(lat, lon, points) : { distKm: 0, offsetKm: 0, point: { lat, lon } };

        // Clean friendly display name
        const parts = (item.display_name || '').split(',');
        const shortTitle = item.name || parts[0] || 'Landmark';
        const contextStr = parts.slice(1, 3).join(',').trim();
        const deducedIcon = POIService.deduceIcon(shortTitle, item.type, {});

        return {
          id: 'search_' + item.osm_id + '_' + Date.now(),
          name: shortTitle,
          fullAddress: contextStr,
          lat: lat,
          lon: lon,
          // Pin snaps to exact runner trajectory point on course
          routeLat: nearest.point.lat,
          routeLon: nearest.point.lon,
          distFromStartKm: nearest.distKm,
          distFromStartMile: nearest.distKm * 0.621371,
          offsetKm: nearest.offsetKm,
          desc: `${(nearest.distKm * 0.621371).toFixed(1)} MI • ${shortTitle.toUpperCase()}`,
          icon: deducedIcon,
          active: true,
          isCustom: true,
          offsetDx: 0,
          offsetDy: 0
        };
      });
    } catch (err) {
      console.warn('Nominatim search error:', err);
      return [];
    }
  }

  /**
   * Automatically fetch cultural landmarks and attractions from OpenStreetMap Overpass API
   * along the route, scoring and filtering for the top 5-8 major cultural highlights.
   */
  async discoverNearbyLandmarksOSM(bounds, points) {
    const { minLat, maxLat, minLon, maxLon } = bounds;
    
    // Add small buffer (~0.01 deg is ~1km)
    const south = Math.max(-90, minLat - 0.008);
    const north = Math.min(90, maxLat + 0.008);
    const west = Math.max(-180, minLon - 0.008);
    const east = Math.min(180, maxLon + 0.008);

    // Query nodes, ways, and relations for famous landmarks, obelisks, monuments, and bridges
    const query = `
      [out:json][timeout:20];
      (
        nwr["man_made"="obelisk"](${south},${west},${north},${east});
        nwr["tourism"="attraction"](${south},${west},${north},${east});
        nwr["historic"~"^(monument|memorial|castle|archaeological_site|palace)$"](${south},${west},${north},${east});
        nwr["bridge"="yes"]["name"](${south},${west},${north},${east});
        nwr["tourism"="viewpoint"](${south},${west},${north},${east});
      );
      out center 75;
    `;

    try {
      const resp = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query)
      });

      if (!resp.ok) {
        throw new Error(`Overpass API responded with HTTP ${resp.status}`);
      }

      const data = await resp.json();
      if (!data.elements || data.elements.length === 0) {
        return [];
      }

      const candidates = [];
      const seenNames = new Set(this.landmarks.map(l => l.name.toLowerCase()));

      for (const el of data.elements) {
        const name = el.tags?.name;
        if (!name || name.trim().length < 3 || seenNames.has(name.toLowerCase())) continue;

        // Use element coordinates or center for ways/relations
        const lat = el.lat !== undefined ? el.lat : el.center?.lat;
        const lon = el.lon !== undefined ? el.lon : el.center?.lon;
        if (lat === undefined || lon === undefined) continue;

        // Check proximity to route (within 400m)
        const nearest = GPXParser.findNearestTrackPoint(lat, lon, points);
        if (nearest.offsetKm > 0.40) continue;

        // Cultural Prominence Scoring System
        let score = 10;
        if (el.tags?.wikipedia) score += 25; // Global renown
        if (el.tags?.wikidata) score += 15;
        if (el.tags?.man_made === 'obelisk') score += 30; // High iconic priority
        if (el.tags?.historic === 'monument' || el.tags?.historic === 'memorial') score += 15;
        if (el.tags?.tourism === 'attraction') score += 15;
        if (el.tags?.bridge) score += 10;

        // Proximity bonus (closer to runner path = higher ranking)
        score += Math.max(0, 10 - nearest.offsetKm * 25);

        const icon = POIService.deduceIcon(name, el.tags?.tourism || el.tags?.historic || '', el.tags);

        seenNames.add(name.toLowerCase());
        candidates.push({
          id: 'osm_' + el.id,
          lat: lat,
          lon: lon,
          // Pin anchors to the exact runner trajectory point on course
          routeLat: nearest.point.lat,
          routeLon: nearest.point.lon,
          name: name,
          desc: el.tags?.tourism || el.tags?.historic || 'Cultural Highlight',
          icon: icon,
          distFromStartKm: nearest.distKm,
          distFromStartMile: nearest.distKm * 0.621371,
          offsetKm: nearest.offsetKm,
          score: score,
          active: true,
          isCustom: false,
          offsetDx: 0,
          offsetDy: 0
        });
      }

      if (candidates.length === 0) return [];

      // Sort by prominence score descending and pick Top 6-8
      candidates.sort((a, b) => b.score - a.score);
      const topHighlights = candidates.slice(0, 7);

      // Re-sort the top 6-8 in sequential course order (Start to Finish)
      topHighlights.sort((a, b) => a.distFromStartKm - b.distFromStartKm);

      // Add discovered to landmarks
      this.landmarks = [...this.landmarks, ...topHighlights];
      this.notify();

      return topHighlights;
    } catch (err) {
      console.warn('OSM POI discovery query error or network limit:', err);
      return [];
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.landmarks));
  }
}

window.POIService = POIService;
