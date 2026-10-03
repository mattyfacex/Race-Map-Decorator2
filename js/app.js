/**
 * Main Application Controller for Race-Map Decorator
 * Glues GPX Parsing, POI Discovery, Story Rendering, and UI Controls.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const canvas = document.getElementById('storyCanvas');
  const fileDropZone = document.getElementById('fileDropZone');
  const gpxFileInput = document.getElementById('gpxFileInput');
  const presetPillsContainer = document.getElementById('presetPills');
  const themeGridContainer = document.getElementById('themeGrid');
  const landmarkListContainer = document.getElementById('landmarkList');
  const discoverOsmBtn = document.getElementById('discoverOsmBtn');
  const addLandmarkBtn = document.getElementById('addLandmarkBtn');
  const landmarkModal = document.getElementById('landmarkModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const saveLandmarkBtn = document.getElementById('saveLandmarkBtn');
  const customPhotoInput = document.getElementById('customPhotoInput');
  const toastEl = document.getElementById('toast');

  // Export Buttons
  const downloadPngBtn = document.getElementById('downloadPngBtn');
  const copyClipboardBtn = document.getElementById('copyClipboardBtn');
  const downloadSvgBtn = document.getElementById('downloadSvgBtn');

  // Color Mode Tabs & Country Flag Elements
  const colorModeTabs = document.querySelectorAll('input[name="colorModeTab"]');
  const countryView = document.getElementById('countryView');
  const majorsView = document.getElementById('majorsView');
  const activeCountryBanner = document.getElementById('activeCountryBanner');
  const activeCountryFlag = document.getElementById('activeCountryFlag');
  const activeCountryName = document.getElementById('activeCountryName');
  const activeCountrySub = document.getElementById('activeCountrySub');
  const activeCountryStripes = document.getElementById('activeCountryStripes');
  const quickCountriesContainer = document.getElementById('quickCountries');
  const countrySearchInput = document.getElementById('countrySearchInput');
  const countryGridContainer = document.getElementById('countryGrid');

  // Input Controls
  const inputRaceTitle = document.getElementById('inputRaceTitle');
  const inputRunnerName = document.getElementById('inputRunnerName');
  const inputBibNumber = document.getElementById('inputBibNumber');
  const inputSubtitle = document.getElementById('inputSubtitle');
  const inputLineWidth = document.getElementById('inputLineWidth');
  const valLineWidth = document.getElementById('valLineWidth');
  const inputGlow = document.getElementById('inputGlow');
  const valGlow = document.getElementById('valGlow');
  const inputScale = document.getElementById('inputScale');
  const valScale = document.getElementById('valScale');
  const inputOffsetY = document.getElementById('inputOffsetY');
  const valOffsetY = document.getElementById('valOffsetY');

  // Toggles
  const toggleSafeZones = document.getElementById('toggleSafeZones');
  const toggleSplits = document.getElementById('toggleSplits');
  const toggleElevation = document.getElementById('toggleElevation');
  const toggleCore = document.getElementById('toggleCore');
  const toggleStats = document.getElementById('toggleStats');

  // Radio / Segmented Groups
  const bgModeRadios = document.querySelectorAll('input[name="bgMode"]');
  const unitRadios = document.querySelectorAll('input[name="unitSystem"]');

  // Core Services
  const renderer = new StoryRenderer(canvas);
  const poiService = new POIService();

  let currentRaceData = null;
  // Default to UK country flag or London theme
  let currentTheme = (typeof COUNTRY_THEMES !== 'undefined' && COUNTRY_THEMES.find(t => t.code === 'GB')) || RACE_THEMES[0];

  // Toast Helper
  const showToast = (message, type = 'info') => {
    toastEl.textContent = message;
    toastEl.className = `toast show ${type}`;
    setTimeout(() => {
      toastEl.className = 'toast';
    }, 3200);
  };

  // Render Theme Selector Grid
  const initThemeGrid = () => {
    themeGridContainer.innerHTML = '';
    RACE_THEMES.forEach(theme => {
      const card = document.createElement('div');
      card.className = `theme-chip ${theme.id === currentTheme.id ? 'active' : ''}`;
      card.dataset.themeId = theme.id;

      const gradStyle = theme.gradient && theme.gradient.length >= 2 
        ? `linear-gradient(135deg, ${theme.gradient.join(', ')})`
        : `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.primary})`;

      card.innerHTML = `
        <div class="theme-swatch" style="background: ${gradStyle};"></div>
        <div class="theme-info">
          <span class="theme-name">${theme.name}</span>
          <span class="theme-badge">${theme.badge}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currentTheme = theme;
        renderer.setTheme(currentTheme);
        renderLandmarksUI();
      });

      themeGridContainer.appendChild(card);
    });
  };

  // Update Active Country Indicator Banner
  const updateActiveCountryBanner = (countryTheme) => {
    if (!countryTheme || !activeCountryBanner) return;
    activeCountryFlag.textContent = countryTheme.flag || '🌍';
    activeCountryName.textContent = countryTheme.name;
    activeCountrySub.textContent = `Route stylized in ${countryTheme.name} flag colors`;
    
    const gradStr = countryTheme.gradient && countryTheme.gradient.length >= 2
      ? `linear-gradient(90deg, ${countryTheme.gradient.join(', ')})`
      : countryTheme.colors.primary;
    activeCountryStripes.style.background = gradStr;
  };

  // Select Country Theme and update entire UI & Canvas
  const selectCountryTheme = (countryTheme) => {
    currentTheme = countryTheme;
    updateActiveCountryBanner(countryTheme);

    // Update active highlight on quick pills and grid
    document.querySelectorAll('.quick-country-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.code === countryTheme.code);
    });
    document.querySelectorAll('.country-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.code === countryTheme.code);
    });

    renderer.setTheme(currentTheme);
    renderLandmarksUI();
    showToast(`Applied ${countryTheme.flag} ${countryTheme.name} flag colors to route!`, 'success');
  };

  // Initialize Country Flag Selection UI
  const initCountryFlagSelector = () => {
    if (typeof COUNTRY_THEMES === 'undefined') return;

    // 1. Featured Quick Country Pills
    const featuredCodes = ['GB', 'US', 'KE', 'JP', 'FR', 'DE', 'ES', 'IT', 'ET', 'BR', 'CA', 'AU', 'NL', 'IE', 'GR', 'CH'];
    quickCountriesContainer.innerHTML = '';
    
    featuredCodes.forEach(code => {
      const c = COUNTRY_THEMES.find(t => t.code === code);
      if (!c) return;
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `quick-country-pill ${c.code === (currentTheme.code || 'GB') ? 'active' : ''}`;
      pill.dataset.code = c.code;
      pill.innerHTML = `<span>${c.flag}</span> <span>${c.name}</span>`;
      pill.addEventListener('click', () => selectCountryTheme(c));
      quickCountriesContainer.appendChild(pill);
    });

    // 2. Full Searchable Country Grid
    const renderCountryGrid = (filterText = '') => {
      countryGridContainer.innerHTML = '';
      const query = filterText.toLowerCase().trim();
      const filtered = COUNTRY_THEMES.filter(c => 
        c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
      );

      if (filtered.length === 0) {
        countryGridContainer.innerHTML = `<div style="grid-column: span 2; text-align: center; color: var(--text-dim); font-size: 11px; padding: 14px;">No matching countries found</div>`;
        return;
      }

      filtered.forEach(c => {
        const chip = document.createElement('div');
        chip.className = `country-chip ${c.code === currentTheme.code ? 'active' : ''}`;
        chip.dataset.code = c.code;

        const gradStr = c.gradient && c.gradient.length >= 2
          ? `linear-gradient(90deg, ${c.gradient.join(', ')})`
          : c.colors.primary;

        chip.innerHTML = `
          <div class="country-chip-left">
            <span class="country-chip-flag">${c.flag}</span>
            <span class="country-chip-name">${c.name}</span>
          </div>
          <div class="country-chip-swatch" style="background: ${gradStr};"></div>
        `;

        chip.addEventListener('click', () => selectCountryTheme(c));
        countryGridContainer.appendChild(chip);
      });
    };

    renderCountryGrid();

    // 3. Search input handler
    countrySearchInput.addEventListener('input', (e) => {
      renderCountryGrid(e.target.value);
    });

    // 4. Tab switcher between Country Flags and World Majors
    colorModeTabs.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'country') {
          countryView.style.display = 'block';
          majorsView.style.display = 'none';
        } else {
          countryView.style.display = 'none';
          majorsView.style.display = 'block';
        }
      });
    });

    // Set initial banner
    updateActiveCountryBanner(currentTheme);
  };

  // Render Built-in Sample Marathon Presets
  const initPresets = () => {
    presetPillsContainer.innerHTML = '';
    SAMPLE_MARATHONS.forEach((sample, idx) => {
      const btn = document.createElement('button');
      btn.className = `preset-btn ${idx === 0 ? 'active' : ''}`;
      btn.innerHTML = `<span>${sample.name}</span> <small>${sample.city}</small>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadSampleMarathon(sample);
      });
      presetPillsContainer.appendChild(btn);
    });
  };

  // Load a sample marathon file
  const loadSampleMarathon = async (sample) => {
    try {
      showToast(`Loading ${sample.name}...`, 'info');
      const resp = await fetch(sample.file);
      if (!resp.ok) throw new Error(`Could not load ${sample.file}`);
      const gpxText = await resp.text();
      
      // Update form values
      inputRaceTitle.value = sample.name;
      if (sample.runner) {
        inputRunnerName.value = sample.runner.name;
        inputBibNumber.value = sample.runner.bib;
      }

      // Automatically select the country flag if available
      if (sample.countryCode && typeof COUNTRY_THEMES !== 'undefined') {
        const countryMatch = COUNTRY_THEMES.find(c => c.code === sample.countryCode);
        if (countryMatch) {
          selectCountryTheme(countryMatch);
        }
      } else {
        const matchedTheme = RACE_THEMES.find(t => t.id === sample.themeId) || RACE_THEMES[0];
        currentTheme = matchedTheme;
        document.querySelectorAll('.theme-chip').forEach(c => {
          c.classList.toggle('active', c.dataset.themeId === currentTheme.id);
        });
        renderer.setTheme(currentTheme);
      }

      processGPXText(gpxText, sample.name);
      showToast(`Loaded ${sample.name} successfully!`, 'success');
    } catch (err) {
      console.error(err);
      showToast(`Failed to load ${sample.name}: ${err.message}`, 'error');
    }
  };

  // Process GPX string
  const processGPXText = (gpxText, overrideTitle = null) => {
    try {
      const raceData = GPXParser.parse(gpxText);
      currentRaceData = raceData;

      if (overrideTitle) {
        raceData.name = overrideTitle;
      }
      inputRaceTitle.value = raceData.name;

      // Initialize POIs from GPX waypoints
      poiService.setLandmarks(raceData.waypoints || []);

      // Update renderer
      renderer.setOptions({
        raceTitle: inputRaceTitle.value,
        runnerName: inputRunnerName.value,
        bibNumber: inputBibNumber.value,
        customSubtitle: inputSubtitle.value
      });

      renderer.setData(raceData, currentTheme, poiService.getLandmarks());
      renderLandmarksUI();
      updateStatsSummaryHUD();
    } catch (err) {
      console.error(err);
      showToast(`Error parsing GPX: ${err.message}`, 'error');
    }
  };

  // Update mini stats HUD above preview
  const updateStatsSummaryHUD = () => {
    if (!currentRaceData) return;
    const isImperial = renderer.options.unitSystem === 'imperial';
    const s = currentRaceData.stats;

    document.getElementById('hudDist').textContent = isImperial 
      ? `${s.distanceMiles.toFixed(1)} mi` 
      : `${s.distanceKm.toFixed(1)} km`;

    document.getElementById('hudTime').textContent = s.durationFormatted;
    
    document.getElementById('hudPace').textContent = isImperial 
      ? `${s.paceMileFormatted} /mi` 
      : `${s.paceKmFormatted} /km`;

    document.getElementById('hudEle').textContent = isImperial 
      ? `+${s.elevationGainFt} ft` 
      : `+${s.elevationGainM} m`;
  };

  // Render Landmarks Management UI
  const renderLandmarksUI = () => {
    const list = poiService.getLandmarks();
    landmarkListContainer.innerHTML = '';

    if (list.length === 0) {
      landmarkListContainer.innerHTML = `
        <div class="empty-landmarks">
          <p>No landmarks detected yet.</p>
          <small>Click "Discover Landmarks" or click the "+ Add Landmark" button.</small>
        </div>
      `;
      return;
    }

    const isImperial = renderer.options.unitSystem === 'imperial';

    list.forEach(lm => {
      const item = document.createElement('div');
      item.className = `landmark-row ${lm.active ? 'active' : 'inactive'}`;

      const iconSvg = POIService.ICONS[lm.icon] || POIService.ICONS.landmark;
      const distStr = isImperial 
        ? `${(lm.distFromStartMile || 0).toFixed(1)} mi` 
        : `${(lm.distFromStartKm || 0).toFixed(1)} km`;

      item.innerHTML = `
        <div class="lm-toggle-wrap">
          <input type="checkbox" id="toggle_${lm.id}" ${lm.active ? 'checked' : ''} />
        </div>
        <div class="lm-icon-badge">${iconSvg}</div>
        <div class="lm-details">
          <input type="text" class="lm-name-input" value="${lm.name}" />
          <span class="lm-dist-tag">${distStr} • ${lm.icon}</span>
        </div>
        <div class="lm-actions">
          <button class="btn-icon-danger lm-del-btn" title="Delete landmark">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `;

      // Checkbox toggle
      const chk = item.querySelector(`#toggle_${lm.id}`);
      chk.addEventListener('change', () => {
        poiService.toggleLandmark(lm.id);
        renderer.setLandmarks(poiService.getLandmarks());
      });

      // Name inline edit
      const nameInp = item.querySelector('.lm-name-input');
      nameInp.addEventListener('change', () => {
        poiService.updateLandmark(lm.id, { name: nameInp.value.trim() });
        renderer.setLandmarks(poiService.getLandmarks());
      });

      // Delete button
      const delBtn = item.querySelector('.lm-del-btn');
      delBtn.addEventListener('click', () => {
        poiService.removeLandmark(lm.id);
        renderer.setLandmarks(poiService.getLandmarks());
        renderLandmarksUI();
      });

      landmarkListContainer.appendChild(item);
    });
  };

  // Discover OSM Landmarks Button
  discoverOsmBtn.addEventListener('click', async () => {
    if (!currentRaceData) {
      showToast('Please load or upload a GPX route first', 'warning');
      return;
    }

    discoverOsmBtn.disabled = true;
    discoverOsmBtn.innerHTML = `<span class="spinner"></span> Querying OpenStreetMap...`;

    try {
      showToast('Scanning course for cultural landmarks & bridges...', 'info');
      const found = await poiService.discoverNearbyLandmarksOSM(currentRaceData.bounds, currentRaceData.points);
      
      if (found.length > 0) {
        showToast(`Discovered ${found.length} cultural landmarks along the route!`, 'success');
        renderer.setLandmarks(poiService.getLandmarks());
        renderLandmarksUI();
      } else {
        showToast('No new cultural landmarks found within 400m of the track.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('OSM query failed. Check connection or retry.', 'error');
    } finally {
      discoverOsmBtn.disabled = false;
      discoverOsmBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Auto-Discover Landmarks (OSM)
      `;
    }
  });

  // Add Custom Landmark Modal
  addLandmarkBtn.addEventListener('click', () => {
    if (!currentRaceData) {
      showToast('Please load a route before adding landmarks', 'warning');
      return;
    }
    landmarkModal.classList.add('open');
  });

  closeModalBtn.addEventListener('click', () => {
    landmarkModal.classList.remove('open');
  });

  // Populate icon picker inside modal
  const iconPickerContainer = document.getElementById('iconPicker');
  let selectedModalIcon = 'landmark';
  
  Object.keys(POIService.ICONS).forEach(key => {
    const iconBtn = document.createElement('button');
    iconBtn.type = 'button';
    iconBtn.className = `icon-choice ${key === 'landmark' ? 'selected' : ''}`;
    iconBtn.innerHTML = POIService.ICONS[key];
    iconBtn.title = key;
    iconBtn.addEventListener('click', () => {
      document.querySelectorAll('.icon-choice').forEach(b => b.classList.remove('selected'));
      iconBtn.classList.add('selected');
      selectedModalIcon = key;
    });
    iconPickerContainer.appendChild(iconBtn);
  });

  saveLandmarkBtn.addEventListener('click', () => {
    const name = document.getElementById('modalLmName').value.trim() || 'Landmark';
    const distRatio = parseFloat(document.getElementById('modalLmPos').value) / 100;
    
    if (!currentRaceData || currentRaceData.points.length === 0) return;

    // Pick point along track based on slider percentage
    const ptIndex = Math.min(
      currentRaceData.points.length - 1,
      Math.floor(distRatio * (currentRaceData.points.length - 1))
    );
    const targetPt = currentRaceData.points[ptIndex];

    poiService.addCustomLandmark(targetPt.lat, targetPt.lon, name, selectedModalIcon, currentRaceData.points);
    renderer.setLandmarks(poiService.getLandmarks());
    renderLandmarksUI();
    
    landmarkModal.classList.remove('open');
    document.getElementById('modalLmName').value = '';
    showToast(`Added landmark: "${name}"`, 'success');
  });

  // File Upload Handlers (Drag & Drop & Input)
  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.gpx')) {
      showToast('Please select a valid .gpx file', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const gpxText = e.target.result;
      const raceName = file.name.replace(/\.gpx$/i, '').replace(/[_-]/g, ' ');
      processGPXText(gpxText, raceName);
      showToast(`Uploaded ${file.name} successfully!`, 'success');
    };
    reader.readAsText(file);
  };

  fileDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropZone.classList.add('drag-active');
  });

  fileDropZone.addEventListener('dragleave', () => {
    fileDropZone.classList.remove('drag-active');
  });

  fileDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropZone.classList.remove('drag-active');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  gpxFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  // Custom User Photo Backdrop Upload
  customPhotoInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const img = new Image();
      img.onload = () => {
        renderer.setCustomBackdrop(img);
        // Switch bgMode radio to custom_photo
        document.querySelector('input[name="bgMode"][value="custom_photo"]').checked = true;
        renderer.setOptions({ backgroundMode: 'custom_photo' });
        showToast('Photo backdrop applied! Export as transparent or full card.', 'success');
      };
      img.src = URL.createObjectURL(file);
    }
  });

  // Background Mode Radio
  bgModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const mode = e.target.value;
      const previewWrapper = document.getElementById('storyPreviewWrapper');
      
      // Update preview wrapper CSS checkerboard
      if (mode === 'transparent') {
        previewWrapper.classList.add('checkerboard-bg');
      } else {
        previewWrapper.classList.remove('checkerboard-bg');
      }

      if (mode === 'custom_photo' && !renderer.customBackdropImage) {
        customPhotoInput.click();
      }

      renderer.setOptions({ backgroundMode: mode });
    });
  });

  // Unit System Radios (Metric vs Imperial)
  unitRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const unit = e.target.value;
      renderer.setOptions({ unitSystem: unit, splitUnit: unit === 'imperial' ? 'mi' : 'km' });
      renderLandmarksUI();
      updateStatsSummaryHUD();
    });
  });

  // Text Inputs
  inputRaceTitle.addEventListener('input', (e) => {
    renderer.setOptions({ raceTitle: e.target.value.trim() || 'RACE DAY' });
  });

  inputRunnerName.addEventListener('input', (e) => {
    renderer.setOptions({ runnerName: e.target.value.trim() });
  });

  inputBibNumber.addEventListener('input', (e) => {
    renderer.setOptions({ bibNumber: e.target.value.trim() });
  });

  inputSubtitle.addEventListener('input', (e) => {
    renderer.setOptions({ customSubtitle: e.target.value.trim() });
  });

  // Slider controls
  inputLineWidth.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    valLineWidth.textContent = `${val}px`;
    renderer.setOptions({ lineWidth: val });
  });

  inputGlow.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    valGlow.textContent = `${val}px`;
    renderer.setOptions({ glowIntensity: val });
  });

  inputScale.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valScale.textContent = `${Math.round(val * 100)}%`;
    renderer.scaleModifier = val;
    renderer.computeProjection();
    renderer.render();
  });

  inputOffsetY.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    valOffsetY.textContent = `${val}px`;
    renderer.offsetY = val;
    renderer.computeProjection();
    renderer.render();
  });

  // Toggles
  toggleSafeZones.addEventListener('change', (e) => {
    renderer.setOptions({ showSafeZones: e.target.checked });
  });

  toggleSplits.addEventListener('change', (e) => {
    renderer.setOptions({ showSplits: e.target.checked });
  });

  toggleElevation.addEventListener('change', (e) => {
    renderer.setOptions({ showElevationProfile: e.target.checked });
  });

  toggleCore.addEventListener('change', (e) => {
    renderer.setOptions({ showRouteCore: e.target.checked });
  });

  toggleStats.addEventListener('change', (e) => {
    renderer.setOptions({ showStatsCard: e.target.checked });
  });

  // Export Action: Download PNG (1080x1920)
  downloadPngBtn.addEventListener('click', async () => {
    try {
      showToast('Generating high-res Instagram Story layer...', 'info');
      const blob = await renderer.toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `${(inputRaceTitle.value || 'race_story').toLowerCase().replace(/\s+/g, '_')}_instagram_overlay.png`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Downloaded 1080x1920 PNG layer! Ready for Instagram Stories.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Export failed: ' + err.message, 'error');
    }
  });

  // Export Action: Copy Image to Clipboard
  copyClipboardBtn.addEventListener('click', async () => {
    try {
      showToast('Copying transparent PNG to clipboard...', 'info');
      const blob = await renderer.toBlob();
      
      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error('Clipboard image copy not supported in this browser. Use "Download PNG".');
      }

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);

      showToast('Copied to clipboard! 📋 Paste directly into Instagram Story or Messages.', 'success');
    } catch (err) {
      console.warn('Clipboard write error:', err);
      showToast(err.message, 'error');
    }
  });

  // Export Action: Download SVG
  downloadSvgBtn.addEventListener('click', () => {
    const svgStr = renderer.toSVG();
    if (!svgStr) return;
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(inputRaceTitle.value || 'race_route').toLowerCase().replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Vector SVG route downloaded.', 'success');
  });

  // Initialize UI components
  initThemeGrid();
  initCountryFlagSelector();
  initPresets();

  // Load first sample marathon (London) by default
  loadSampleMarathon(SAMPLE_MARATHONS[0]);
});
