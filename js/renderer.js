/**
 * Canvas Rendering Engine for Instagram Story (1080 x 1920)
 * Handles Web Mercator projection, route path styling, glowing layers,
 * landmark leader lines & badges, race statistics card, and transparent exports.
 */

class StoryRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Fixed native Instagram Story dimensions
    this.storyWidth = 1080;
    this.storyHeight = 1920;
    
    // Set internal resolution
    this.canvas.width = this.storyWidth;
    this.canvas.height = this.storyHeight;

    // View & Projection settings
    this.padding = { top: 320, bottom: 420, left: 120, right: 120 };
    this.scaleModifier = 1.0;
    this.offsetY = 0; // vertical shift
    this.offsetX = 0;

    // Active race & styling state
    this.raceData = null;
    this.theme = null;
    this.landmarks = [];
    this.customBackdropImage = null;

    // Display options
    this.options = {
      backgroundMode: 'transparent', // 'transparent', 'dark_grid', 'minimal_slate', 'custom_photo'
      photoOpacity: 0.9,
      showSafeZones: false,
      showSplits: true,
      splitUnit: 'km', // 'km' or 'mi'
      showLandmarks: true,
      showElevationProfile: true,
      showStatsCard: true,
      statsPosition: 'bottom', // 'bottom', 'top', 'split'
      lineWidth: 9,
      glowIntensity: 20,
      showRouteCore: true,
      unitSystem: 'metric', // 'metric' (km, m) or 'imperial' (mi, ft)
      runnerName: 'Alex Morgan',
      bibNumber: 'BIB 14920',
      raceTitle: 'LONDON MARATHON',
      customSubtitle: 'FINISHER • 42.195 KM',
      showRunnerInfo: true
    };

    // Landmark callout layout cache for hit detection and dragging
    this.renderedLandmarkBadges = [];
    this.draggedLandmark = null;
    this.dragStart = { x: 0, y: 0 };

    this.initInteraction();
  }

  setData(raceData, theme, landmarks) {
    this.raceData = raceData;
    this.theme = theme;
    this.landmarks = landmarks;
    this.computeProjection();
    this.render();
  }

  setTheme(theme) {
    this.theme = theme;
    this.render();
  }

  setLandmarks(landmarks) {
    this.landmarks = landmarks;
    this.render();
  }

  setOptions(newOpts) {
    Object.assign(this.options, newOpts);
    this.render();
  }

  setCustomBackdrop(imgElement) {
    this.customBackdropImage = imgElement;
    this.render();
  }

  /**
   * Project geographic coordinates (lat, lon) to Instagram Story Canvas (1080x1920)
   */
  computeProjection() {
    if (!this.raceData || !this.raceData.points || this.raceData.points.length === 0) return;

    const points = this.raceData.points;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    // Precompute Mercator coordinates for all points (both X and Y in radians)
    this.mercatorPoints = points.map(p => {
      const x = (p.lon * Math.PI) / 180;
      const latRad = (p.lat * Math.PI) / 180;
      const clampedLatRad = Math.max(-1.48, Math.min(1.48, latRad));
      const y = Math.log(Math.tan(Math.PI / 4 + clampedLatRad / 2));
      
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      return { x, y, raw: p };
    });

    const spanX = maxX - minX || 0.00001;
    const spanY = maxY - minY || 0.00001;

    // Available canvas area
    const availWidth = this.storyWidth - (this.padding.left + this.padding.right);
    const availHeight = this.storyHeight - (this.padding.top + this.padding.bottom);

    // Uniform aspect-ratio scaling (preserves the real shape of the race course)
    const scaleX = availWidth / spanX;
    const scaleY = availHeight / spanY;
    this.baseScale = Math.min(scaleX, scaleY) * this.scaleModifier;

    // Center offsets
    const contentCenterX = minX + spanX / 2;
    const contentCenterY = minY + spanY / 2;
    const targetCenterX = this.storyWidth / 2 + this.offsetX;
    const targetCenterY = this.padding.top + availHeight / 2 + this.offsetY;

    this.projMinX = minX;
    this.projMinY = minY;
    this.contentCenterX = contentCenterX;
    this.contentCenterY = contentCenterY;
    this.targetCenterX = targetCenterX;
    this.targetCenterY = targetCenterY;

    // Helper conversion from Lat/Lon to Canvas (x, y)
    this.projectCoord = (lat, lon) => {
      const x = (lon * Math.PI) / 180;
      const latRad = (lat * Math.PI) / 180;
      const clampedLatRad = Math.max(-1.48, Math.min(1.48, latRad));
      const y = Math.log(Math.tan(Math.PI / 4 + clampedLatRad / 2));
      
      const px = this.targetCenterX + (x - this.contentCenterX) * this.baseScale;
      // Invert Y because canvas Y points downwards
      const py = this.targetCenterY - (y - this.contentCenterY) * this.baseScale;
      return { x: px, y: py };
    };
  }

  /**
   * Main render cycle
   */
  render() {
    const ctx = this.ctx;
    const w = this.storyWidth;
    const h = this.storyHeight;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    if (!this.raceData || !this.theme) {
      this.drawEmptyPlaceholder(ctx, w, h);
      return;
    }

    // 1. Draw Background Layer (Transparent, Dark Grid, Slate, or Photo Backdrop)
    this.drawBackground(ctx, w, h);

    // 2. Draw Subtle Map Grid or Street-line accents (if non-transparent mode)
    if (this.options.backgroundMode !== 'transparent') {
      this.drawStylizedGrid(ctx, w, h);
    }

    // 3. Draw Route Path (Outer glow, gradient stroke, inner core)
    this.drawRoutePath(ctx);

    // 4. Draw Splits (KM or Mile markers)
    if (this.options.showSplits) {
      this.drawSplitMarkers(ctx);
    }

    // 5. Draw Start & Finish Course Markers
    this.drawStartFinishNodes(ctx);

    // 6. Draw Landmarks & Cultural POI Badges
    if (this.options.showLandmarks) {
      this.drawLandmarks(ctx);
    }

    // 7. Draw Elevation Profile Strip (lower third)
    if (this.options.showElevationProfile && this.options.showStatsCard) {
      this.drawElevationMiniProfile(ctx);
    }

    // 8. Draw Header & Instagram Race Stats HUD Card
    if (this.options.showStatsCard) {
      this.drawStatsCard(ctx);
    }

    // 9. Draw Instagram Story Safe-Zone Guides (if enabled in UI)
    if (this.options.showSafeZones) {
      this.drawSafeZoneGuides(ctx, w, h);
    }
  }

  drawEmptyPlaceholder(ctx, w, h) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#64748b';
    ctx.font = '600 32px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Select a sample marathon or upload a GPX file', w / 2, h / 2);
  }

  drawBackground(ctx, w, h) {
    const mode = this.options.backgroundMode;

    if (mode === 'transparent') {
      // Keep completely transparent for Instagram Story Sticker layer!
      return;
    }

    if (mode === 'custom_photo' && this.customBackdropImage) {
      // Draw user's race photo
      const img = this.customBackdropImage;
      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > canvasRatio) {
        drawH = h;
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
        drawY = 0;
      } else {
        drawW = w;
        drawH = w / imgRatio;
        drawX = 0;
        drawY = (h - drawH) / 2;
      }

      ctx.save();
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      // Subtle dark vignette gradient overlay to make map pop
      const vig = ctx.createLinearGradient(0, 0, 0, h);
      vig.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      vig.addColorStop(0.3, 'rgba(0, 0, 0, 0.25)');
      vig.addColorStop(0.7, 'rgba(0, 0, 0, 0.35)');
      vig.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
      return;
    }

    if (mode === 'dark_grid') {
      // Ultra-sleek obsidian background
      const grad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, h * 0.7);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      return;
    }

    if (mode === 'minimal_slate') {
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, w, h);
    }
  }

  drawStylizedGrid(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;

    const step = 80;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Subtle coordinates ticks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = '10px monospace';
    ctx.fillText(`${this.raceData.bounds.centerLat.toFixed(3)}° N, ${this.raceData.bounds.centerLon.toFixed(3)}° W`, 40, h - 30);
    ctx.restore();
  }

  /**
   * Helper: Parse hex color to RGB tuple
   */
  static parseHex(hex) {
    if (!hex) return [255, 255, 255];
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    if (isNaN(num)) return [255, 255, 255];
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  /**
   * Interpolate between an array of color stops at progress t (0.0 to 1.0)
   */
  static interpolateColor(stops, t) {
    if (!stops || stops.length === 0) return '#FFFFFF';
    if (stops.length === 1) return stops[0];
    const clampedT = Math.max(0, Math.min(1, t));
    const scaled = clampedT * (stops.length - 1);
    const idx = Math.floor(scaled);
    const frac = scaled - idx;
    if (idx >= stops.length - 1) return stops[stops.length - 1];

    const rgb1 = StoryRenderer.parseHex(stops[idx]);
    const rgb2 = StoryRenderer.parseHex(stops[idx + 1]);

    const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * frac);
    const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * frac);
    const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * frac);
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Draw the stylized glowing route path with country flag or marathon styling
   */
  drawRoutePath(ctx) {
    const points = this.raceData.points;
    if (points.length < 2) return;

    const canvasPoints = points.map(p => this.projectCoord(p.lat, p.lon));
    const baseWidth = this.options.lineWidth;

    // If theme is a Country Flag theme, render with sequential flag flow
    const isCountryTheme = this.theme.category === 'Country Flag' || (this.theme.gradient && this.theme.gradient.length > 2);
    if (isCountryTheme) {
      this.drawCountryFlagRoute(ctx, canvasPoints, baseWidth);
      return;
    }

    // Default marathon major gradient rendering
    const pStart = canvasPoints[0];
    const pEnd = canvasPoints[canvasPoints.length - 1];
    const gradient = ctx.createLinearGradient(pStart.x, pStart.y, pEnd.x, pEnd.y);
    
    if (this.theme.gradient && this.theme.gradient.length >= 2) {
      const stops = this.theme.gradient;
      stops.forEach((c, idx) => {
        gradient.addColorStop(idx / (stops.length - 1), c);
      });
    } else {
      gradient.addColorStop(0, this.theme.colors.secondary || '#00F2FE');
      gradient.addColorStop(1, this.theme.colors.primary || '#FF5500');
    }

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Layer 1: Diffuse Glow (Bloom)
    if (this.options.glowIntensity > 0) {
      ctx.shadowColor = this.theme.colors.glow || this.theme.colors.primary;
      ctx.shadowBlur = this.options.glowIntensity * 1.5;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = baseWidth + 8;
      this.tracePath(ctx, canvasPoints);
      ctx.stroke();
    }

    // Layer 2: Main saturated vibrant stroke
    ctx.shadowBlur = 0;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = baseWidth;
    this.tracePath(ctx, canvasPoints);
    ctx.stroke();

    // Layer 3: Razor-sharp inner core highlight
    if (this.options.showRouteCore) {
      ctx.strokeStyle = this.theme.colors.core || '#FFFFFF';
      ctx.lineWidth = Math.max(2, baseWidth * 0.28);
      this.tracePath(ctx, canvasPoints);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Render Route Path flowing seamlessly through National Flag Colors
   */
  drawCountryFlagRoute(ctx, canvasPoints, baseWidth) {
    const stops = this.theme.gradient || [this.theme.colors.primary, this.theme.colors.secondary];
    const numPts = canvasPoints.length;
    const chunkSize = Math.max(1, Math.floor(numPts / 50));

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Layer 1: Glowing outer bloom with primary flag glow
    if (this.options.glowIntensity > 0) {
      ctx.shadowColor = this.theme.colors.glow || this.theme.colors.primary;
      ctx.shadowBlur = this.options.glowIntensity * 1.5;
      ctx.lineWidth = baseWidth + 8;

      for (let i = 0; i < numPts - 1; i += chunkSize) {
        const endIdx = Math.min(numPts - 1, i + chunkSize + 1);
        const t = (i + endIdx) / (2 * (numPts - 1));
        ctx.strokeStyle = StoryRenderer.interpolateColor(stops, t);

        ctx.beginPath();
        ctx.moveTo(canvasPoints[i].x, canvasPoints[i].y);
        for (let j = i + 1; j <= endIdx; j++) {
          ctx.lineTo(canvasPoints[j].x, canvasPoints[j].y);
        }
        ctx.stroke();
      }
    }

    // Layer 2: Main vibrant flag color flow along route
    ctx.shadowBlur = 0;
    ctx.lineWidth = baseWidth;

    for (let i = 0; i < numPts - 1; i += chunkSize) {
      const endIdx = Math.min(numPts - 1, i + chunkSize + 1);
      const t = (i + endIdx) / (2 * (numPts - 1));
      ctx.strokeStyle = StoryRenderer.interpolateColor(stops, t);

      ctx.beginPath();
      ctx.moveTo(canvasPoints[i].x, canvasPoints[i].y);
      for (let j = i + 1; j <= endIdx; j++) {
        ctx.lineTo(canvasPoints[j].x, canvasPoints[j].y);
      }
      ctx.stroke();
    }

    // Layer 3: Razor-sharp inner core highlight
    if (this.options.showRouteCore) {
      ctx.strokeStyle = this.theme.colors.core || '#FFFFFF';
      ctx.lineWidth = Math.max(2, baseWidth * 0.28);
      this.tracePath(ctx, canvasPoints);
      ctx.stroke();
    }

    ctx.restore();
  }

  tracePath(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
  }

  /**
   * Draw Start & Finish Course Badges
   */
  drawStartFinishNodes(ctx) {
    const points = this.raceData.points;
    const startPt = this.projectCoord(points[0].lat, points[0].lon);
    const finishPt = this.projectCoord(points[points.length - 1].lat, points[points.length - 1].lon);

    // 1. START NODE
    this.drawPinNode(ctx, startPt.x, startPt.y, 'START', '#00E676', '#FFFFFF');

    // 2. FINISH NODE
    this.drawPinNode(ctx, finishPt.x, finishPt.y, 'FINISH', this.theme.colors.finishBadge || '#FF5500', '#FFFFFF');
  }

  drawPinNode(ctx, x, y, label, bgColor, textColor) {
    ctx.save();

    // Outer pulsating ring
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.globalAlpha = 0.25;
    ctx.fill();

    // Solid inner pin
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Floating text label badge
    ctx.font = '700 13px "Outfit", sans-serif';
    const textWidth = ctx.measureText(label).width;
    const padX = 10;
    const pillW = textWidth + padX * 2;
    const pillH = 26;
    const pillX = x - pillW / 2;
    const pillY = y - 36;

    // Badge shadow & background
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    this.roundRect(ctx, pillX, pillY, pillW, pillH, 13);
    ctx.fill();

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = bgColor;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, pillY + pillH / 2);

    ctx.restore();
  }

  /**
   * Draw Split Markers (KM or Mile dots along the route)
   */
  drawSplitMarkers(ctx) {
    const isMile = this.options.splitUnit === 'mi';
    const splits = isMile ? this.raceData.mileSplits : this.raceData.kmSplits;
    if (!splits || splits.length === 0) return;

    // Pick reasonable intervals so line is not crowded
    const step = isMile ? 5 : 5; // e.g. 5, 10, 15, 20...
    const filtered = splits.filter(s => s.number % step === 0 || s.number === 1);

    ctx.save();
    filtered.forEach(s => {
      const pt = this.projectCoord(s.lat, s.lon);
      
      // Outer subtle dot
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = this.theme.colors.primary;
      ctx.stroke();

      // Number badge
      ctx.font = '600 11px "Space Grotesk", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.textAlign = 'center';
      ctx.fillText(`${s.number}${isMile ? 'M' : 'K'}`, pt.x, pt.y + 16);
    });
    ctx.restore();
  }

  /**
   * Draw Landmarks & Cultural Points of Interest with Sleek Leader Lines and Badges
   */
  drawLandmarks(ctx) {
    this.renderedLandmarkBadges = [];
    const activeLandmarks = this.landmarks.filter(l => l.active);
    if (activeLandmarks.length === 0) return;

    // Stagger angles so leader lines don't collide
    const defaultAngles = [
      { dx: 95, dy: -60 },
      { dx: -105, dy: -70 },
      { dx: 110, dy: 65 },
      { dx: -110, dy: 60 },
      { dx: 120, dy: -40 },
      { dx: -125, dy: -45 }
    ];

    activeLandmarks.forEach((lm, index) => {
      const routePt = this.projectCoord(lm.routeLat || lm.lat, lm.routeLon || lm.lon);
      
      // Determine callout badge offset (user custom dragged offset or auto staggered)
      let offset = defaultAngles[index % defaultAngles.length];
      if (lm.offsetDx !== 0 || lm.offsetDy !== 0) {
        offset = { dx: lm.offsetDx, dy: lm.offsetDy };
      }

      const badgeX = routePt.x + offset.dx;
      const badgeY = routePt.y + offset.dy;

      // Draw Leader Line connecting route pin to badge
      this.drawLeaderLine(ctx, routePt.x, routePt.y, badgeX, badgeY);

      // Draw Route Anchor Dot
      ctx.save();
      ctx.beginPath();
      ctx.arc(routePt.x, routePt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = this.theme.colors.secondary || '#00F2FE';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
      ctx.restore();

      // Draw Landmark Callout Pill Badge
      const badgeInfo = this.drawLandmarkBadge(ctx, lm, badgeX, badgeY);
      this.renderedLandmarkBadges.push({
        landmark: lm,
        bounds: badgeInfo
      });
    });
  }

  drawLeaderLine(ctx, fromX, fromY, toX, toY) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);

    // Elegant dog-leg / curved connector
    const midX = fromX + (toX - fromX) * 0.45;
    const midY = fromY;
    ctx.lineTo(midX, midY);
    ctx.lineTo(toX, toY);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  }

  drawLandmarkBadge(ctx, lm, x, y) {
    ctx.save();

    // Text formatting
    const title = lm.name.toUpperCase();
    const isMile = this.options.unitSystem === 'imperial';
    const distVal = isMile ? (lm.distFromStartMile || 0) : (lm.distFromStartKm || 0);
    const unitStr = isMile ? 'MI' : 'KM';
    const subtitle = lm.desc || `${distVal.toFixed(1)} ${unitStr} MARK`;

    ctx.font = '700 16px "Outfit", sans-serif';
    const titleWidth = ctx.measureText(title).width;
    
    ctx.font = '500 12px "Space Grotesk", sans-serif';
    const subWidth = ctx.measureText(subtitle).width;

    const contentWidth = Math.max(titleWidth, subWidth);
    const iconBoxSize = 36;
    const paddingX = 14;
    const badgeW = iconBoxSize + contentWidth + paddingX * 2 + 10;
    const badgeH = 46;

    // Anchor badge relative to connector point
    // If x > route point, badge extends rightward; if x < route point, extends leftward
    const drawX = x > 0 ? x : x - badgeW;
    const drawY = y - badgeH / 2;

    // Badge Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;

    // Glassmorphic / Solid badge background
    ctx.fillStyle = this.theme.colors.landmarkBadge || 'rgba(15, 23, 42, 0.9)';
    this.roundRect(ctx, drawX, drawY, badgeW, badgeH, 14);
    ctx.fill();

    // Vibrant Glowing Accent Border
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = this.theme.colors.landmarkBorder || this.theme.colors.primary;
    ctx.stroke();

    ctx.shadowBlur = 0; // reset shadow

    // Icon Circle Container
    const iconCircleX = drawX + paddingX + iconBoxSize / 2;
    const iconCircleY = drawY + badgeH / 2;
    ctx.beginPath();
    ctx.arc(iconCircleX, iconCircleY, iconBoxSize / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill();

    // Render Icon Glyph
    this.renderLandmarkIconGlyph(ctx, lm.icon, iconCircleX, iconCircleY);

    // Text Content
    const textStartX = drawX + paddingX + iconBoxSize + 8;
    
    // Title
    ctx.font = '700 15px "Outfit", sans-serif';
    ctx.fillStyle = this.theme.colors.landmarkText || '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(title, textStartX, drawY + 8);

    // Subtitle / Distance
    ctx.font = '600 11px "Space Grotesk", sans-serif';
    ctx.fillStyle = this.theme.colors.secondary || '#38BDF8';
    ctx.fillText(subtitle, textStartX, drawY + 26);

    ctx.restore();

    return { x: drawX, y: drawY, width: badgeW, height: badgeH };
  }

  renderLandmarkIconGlyph(ctx, iconType, cx, cy) {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (iconType) {
      case 'bridge':
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy + 6);
        ctx.lineTo(cx + 8, cy + 6);
        ctx.moveTo(cx - 8, cy + 2);
        ctx.quadraticCurveTo(cx, cy - 8, cx + 8, cy + 2);
        ctx.moveTo(cx - 4, cy + 2);
        ctx.lineTo(cx - 4, cy + 6);
        ctx.moveTo(cx + 4, cy + 2);
        ctx.lineTo(cx + 4, cy + 6);
        ctx.stroke();
        break;

      case 'mountain':
        ctx.beginPath();
        ctx.moveTo(cx - 9, cy + 7);
        ctx.lineTo(cx - 2, cy - 6);
        ctx.lineTo(cx + 3, cy + 1);
        ctx.lineTo(cx + 6, cy - 3);
        ctx.lineTo(cx + 10, cy + 7);
        ctx.closePath();
        ctx.stroke();
        break;

      case 'clock':
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - 4);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + 3, cy + 2);
        ctx.stroke();
        break;

      case 'flag_finish':
      case 'trophy':
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - 6);
        ctx.lineTo(cx + 6, cy - 6);
        ctx.lineTo(cx + 4, cy);
        ctx.quadraticCurveTo(cx, cy + 6, cx - 4, cy);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy + 4);
        ctx.lineTo(cx, cy + 8);
        ctx.moveTo(cx - 5, cy + 8);
        ctx.lineTo(cx + 5, cy + 8);
        ctx.stroke();
        break;

      case 'cheer':
      case 'star':
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const rOuter = 8;
          const rInner = 3.5;
          const rot = (Math.PI / 2) * 3;
          const step = Math.PI / 5;
          let angle = rot + i * step * 2;
          let sx = cx + Math.cos(angle) * rOuter;
          let sy = cy + Math.sin(angle) * rOuter;
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
          angle += step;
          sx = cx + Math.cos(angle) * rInner;
          sy = cy + Math.sin(angle) * rInner;
          ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fillStyle = '#FFD100';
        ctx.fill();
        break;

      case 'beer':
        ctx.beginPath();
        ctx.rect(cx - 6, cy - 6, 8, 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 4, cy, 4, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        break;

      case 'park':
        ctx.beginPath();
        ctx.moveTo(cx, cy - 8);
        ctx.lineTo(cx - 6, cy);
        ctx.lineTo(cx - 3, cy);
        ctx.lineTo(cx - 7, cy + 6);
        ctx.lineTo(cx + 7, cy + 6);
        ctx.lineTo(cx + 3, cy);
        ctx.lineTo(cx + 6, cy);
        ctx.closePath();
        ctx.fillStyle = '#10B981';
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, cy + 6);
        ctx.lineTo(cx, cy + 9);
        ctx.stroke();
        break;

      default:
        // Classical Landmark Monument
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy - 4);
        ctx.lineTo(cx, cy - 8);
        ctx.lineTo(cx + 8, cy - 4);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - 3);
        ctx.lineTo(cx - 6, cy + 6);
        ctx.moveTo(cx - 1, cy - 3);
        ctx.lineTo(cx - 1, cy + 6);
        ctx.moveTo(cx + 4, cy - 3);
        ctx.lineTo(cx + 4, cy + 6);
        ctx.moveTo(cx - 8, cy + 7);
        ctx.lineTo(cx + 8, cy + 7);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }

  /**
   * Draw Elevation Mini-Profile Strip
   */
  drawElevationMiniProfile(ctx) {
    const points = this.raceData.points;
    if (points.length < 10) return;

    const stripW = 920;
    const stripH = 65;
    const stripX = (this.storyWidth - stripW) / 2;
    const stripY = this.storyHeight - 440; // positioned right above stats card

    let minEle = Infinity;
    let maxEle = -Infinity;
    points.forEach(p => {
      if (p.ele < minEle) minEle = p.ele;
      if (p.ele > maxEle) maxEle = p.ele;
    });
    const eleSpan = Math.max(15, maxEle - minEle);

    ctx.save();

    // Subtle backdrop container
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    this.roundRect(ctx, stripX, stripY - 15, stripW, stripH + 28, 14);
    ctx.fill();

    // Title label
    ctx.font = '600 11px "Space Grotesk", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'left';
    ctx.fillText('ELEVATION PROFILE', stripX + 16, stripY);

    ctx.textAlign = 'right';
    const isImperial = this.options.unitSystem === 'imperial';
    const gainStr = isImperial ? `+${this.raceData.stats.elevationGainFt} FT` : `+${this.raceData.stats.elevationGainM} M`;
    ctx.fillText(gainStr, stripX + stripW - 16, stripY);

    // Draw filled curve
    ctx.beginPath();
    ctx.moveTo(stripX + 16, stripY + stripH);

    for (let i = 0; i < points.length; i++) {
      const px = stripX + 16 + (i / (points.length - 1)) * (stripW - 32);
      const normEle = (points[i].ele - minEle) / eleSpan;
      const py = stripY + stripH - normEle * (stripH - 15);
      ctx.lineTo(px, py);
    }

    ctx.lineTo(stripX + stripW - 16, stripY + stripH);
    ctx.closePath();

    const eleGrad = ctx.createLinearGradient(0, stripY, 0, stripY + stripH);
    eleGrad.addColorStop(0, this.theme.colors.primary || '#FF5500');
    eleGrad.addColorStop(1, 'rgba(255, 85, 0, 0.02)');
    ctx.fillStyle = eleGrad;
    ctx.fill();

    // Stroke top edge
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const px = stripX + 16 + (i / (points.length - 1)) * (stripW - 32);
      const normEle = (points[i].ele - minEle) / eleSpan;
      const py = stripY + stripH - normEle * (stripH - 15);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = this.theme.colors.secondary || '#00F2FE';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draw Modern Race Stats Card and Story Header
   */
  drawStatsCard(ctx) {
    const isImperial = this.options.unitSystem === 'imperial';
    const stats = this.raceData.stats;

    // Values formatted by unit
    const distText = isImperial ? `${stats.distanceMiles.toFixed(1)} MI` : `${stats.distanceKm.toFixed(1)} KM`;
    const paceText = isImperial ? `${stats.paceMileFormatted} /MI` : `${stats.paceKmFormatted} /KM`;
    const timeText = stats.durationFormatted;
    const eleText = isImperial ? `+${stats.elevationGainFt} FT` : `+${stats.elevationGainM} M`;

    // 1. TOP HEADER (Race Title, Runner Name, Date)
    ctx.save();
    const topY = 210; // below Instagram top safe zone
    
    // Top category / pill badge (incorporating flag emoji if active)
    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.fillStyle = this.theme.colors.secondary || '#38BDF8';
    ctx.textAlign = 'center';
    const flagPrefix = this.theme.flag ? `${this.theme.flag} ` : '';
    const subtitleText = `${flagPrefix}${(this.options.customSubtitle || 'OFFICIAL FINISHER').toUpperCase()}`;
    ctx.fillText(subtitleText, this.storyWidth / 2, topY);

    // Main Big Race Title
    ctx.font = '900 46px "Outfit", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 16;
    ctx.fillText(this.options.raceTitle.toUpperCase(), this.storyWidth / 2, topY + 48);

    // Runner Name & Bib
    if (this.options.showRunnerInfo) {
      ctx.font = '600 16px "Space Grotesk", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const runnerStr = `${this.options.runnerName.toUpperCase()}  •  ${this.options.bibNumber}  •  ${stats.startTime}`;
      ctx.fillText(runnerStr, this.storyWidth / 2, topY + 82);
    }
    ctx.restore();

    // 2. BOTTOM STATS CARD
    ctx.save();
    const cardW = 920;
    const cardH = 110;
    const cardX = (this.storyWidth - cardW) / 2;
    const cardY = this.storyHeight - 330; // Above Instagram bottom reply bar safe zone

    // Frosted Glassmorphism card
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;

    ctx.fillStyle = this.theme.colors.statsBg || 'rgba(15, 23, 42, 0.88)';
    this.roundRect(ctx, cardX, cardY, cardW, cardH, 20);
    ctx.fill();

    // Vibrant Border
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = this.theme.colors.statsAccent || this.theme.colors.primary;
    ctx.stroke();

    ctx.shadowBlur = 0; // reset

    // 4 Metric Columns: Distance, Time, Pace, Elevation
    const metrics = [
      { label: 'DISTANCE', val: distText },
      { label: 'TIME', val: timeText },
      { label: 'AVG PACE', val: paceText },
      { label: 'ELEV GAIN', val: eleText }
    ];

    const colW = cardW / metrics.length;
    metrics.forEach((m, idx) => {
      const colCenterX = cardX + colW * idx + colW / 2;

      // Divider vertical line
      if (idx > 0) {
        ctx.beginPath();
        ctx.moveTo(cardX + colW * idx, cardY + 22);
        ctx.lineTo(cardX + colW * idx, cardY + cardH - 22);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Label
      ctx.font = '700 11px "Space Grotesk", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.textAlign = 'center';
      ctx.fillText(m.label, colCenterX, cardY + 36);

      // Value
      ctx.font = '800 24px "Outfit", sans-serif';
      ctx.fillStyle = this.theme.colors.statsText || '#FFFFFF';
      ctx.fillText(m.val, colCenterX, cardY + 74);
    });

    ctx.restore();
  }

  /**
   * Instagram Story Safe-Zone Guides
   * Top 180px: profile picture, handle, close button
   * Bottom 220px: send message input bar and actions
   */
  drawSafeZoneGuides(ctx, w, h) {
    ctx.save();
    
    // Top Danger Zone
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(0, 0, w, 180);
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(0, 180);
    ctx.lineTo(w, 180);
    ctx.stroke();

    ctx.font = '700 14px "Outfit", sans-serif';
    ctx.fillStyle = '#EF4444';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ INSTAGRAM TOP SAFE ZONE (HEADER / USERNAME / CLOSE)', w / 2, 95);

    // Bottom Danger Zone
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(0, h - 220, w, 220);
    ctx.beginPath();
    ctx.moveTo(0, h - 220);
    ctx.lineTo(w, h - 220);
    ctx.stroke();

    ctx.fillText('⚠️ INSTAGRAM BOTTOM SAFE ZONE (REPLY BAR / STICKERS)', w / 2, h - 105);

    ctx.restore();
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Drag interaction for moving landmark badges directly on the canvas
   */
  initInteraction() {
    let isDragging = false;
    let selectedBadge = null;

    const getCanvasPos = (evt) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleFactorX = this.storyWidth / rect.width;
      const scaleFactorY = this.storyHeight / rect.height;
      return {
        x: (evt.clientX - rect.left) * scaleFactorX,
        y: (evt.clientY - rect.top) * scaleFactorY
      };
    };

    this.canvas.addEventListener('mousedown', (e) => {
      const pos = getCanvasPos(e);
      // Check if clicked inside any rendered landmark badge
      for (const item of this.renderedLandmarkBadges) {
        const b = item.bounds;
        if (pos.x >= b.x && pos.x <= b.x + b.width && pos.y >= b.y && pos.y <= b.y + b.height) {
          isDragging = true;
          selectedBadge = item;
          this.dragStart = { x: pos.x, y: pos.y };
          this.canvas.style.cursor = 'grabbing';
          e.preventDefault();
          return;
        }
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !selectedBadge) return;
      const pos = getCanvasPos(e);
      const deltaX = pos.x - this.dragStart.x;
      const deltaY = pos.y - this.dragStart.y;

      const lm = selectedBadge.landmark;
      lm.offsetDx = (lm.offsetDx || 0) + deltaX;
      lm.offsetDy = (lm.offsetDy || 0) + deltaY;

      this.dragStart = { x: pos.x, y: pos.y };
      this.render();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        selectedBadge = null;
        this.canvas.style.cursor = 'default';
      }
    });
  }

  /**
   * Export Canvas as PNG Blob (maintaining transparency)
   */
  toBlob() {
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  }

  /**
   * Generate SVG export string for vector graphics
   */
  toSVG() {
    if (!this.raceData || !this.raceData.points) return '';
    const points = this.raceData.points;
    const canvasPoints = points.map(p => this.projectCoord(p.lat, p.lon));
    
    let pathD = `M ${canvasPoints[0].x.toFixed(1)} ${canvasPoints[0].y.toFixed(1)}`;
    for (let i = 1; i < canvasPoints.length; i++) {
      pathD += ` L ${canvasPoints[i].x.toFixed(1)} ${canvasPoints[i].y.toFixed(1)}`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${this.theme.colors.secondary || '#00F2FE'}" />
      <stop offset="100%" stop-color="${this.theme.colors.primary || '#FF5500'}" />
    </linearGradient>
  </defs>
  <path d="${pathD}" fill="none" stroke="url(#routeGrad)" stroke-width="${this.options.lineWidth}" stroke-linecap="round" stroke-linejoin="round" />
  <path d="${pathD}" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;
  }
}

window.StoryRenderer = StoryRenderer;
