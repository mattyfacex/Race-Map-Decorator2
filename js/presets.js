/**
 * Presets for Race Themes, Palettes, and Built-in Marathon Tracks
 */

const RACE_THEMES = [
  {
    id: 'london',
    name: 'London Marathon',
    category: 'World Major',
    badge: '🇬🇧 TCS London',
    colors: {
      primary: '#E51937',      // TCS Red
      secondary: '#00A3E0',    // London Cyan / Thames Blue
      glow: 'rgba(229, 25, 55, 0.45)',
      core: '#FFFFFF',
      startBadge: '#00C853',
      finishBadge: '#E51937',
      landmarkBadge: '#141E30',
      landmarkBorder: '#00A3E0',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(15, 23, 42, 0.82)',
      statsAccent: '#E51937',
      statsText: '#FFFFFF'
    },
    gradient: ['#00A3E0', '#FF3366', '#E51937']
  },
  {
    id: 'boston',
    name: 'Boston Marathon',
    category: 'World Major',
    badge: '🦄 BAA Boston',
    colors: {
      primary: '#002B49',      // Athletic Navy
      secondary: '#FFD100',    // Unicorn Gold / Yellow
      glow: 'rgba(255, 209, 0, 0.55)',
      core: '#FFFBDF',
      startBadge: '#00E676',
      finishBadge: '#FFD100',
      landmarkBadge: '#001A2C',
      landmarkBorder: '#FFD100',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(0, 27, 49, 0.85)',
      statsAccent: '#FFD100',
      statsText: '#FFFFFF'
    },
    gradient: ['#002B49', '#0075FF', '#FFD100']
  },
  {
    id: 'nyc',
    name: 'NYC Marathon',
    category: 'World Major',
    badge: '🗽 TCS New York',
    colors: {
      primary: '#FF5500',      // NYC Vivid Orange
      secondary: '#00F2FE',    // Hudson Cyan
      glow: 'rgba(255, 85, 0, 0.5)',
      core: '#FFFFFF',
      startBadge: '#00E676',
      finishBadge: '#FF5500',
      landmarkBadge: '#0B132B',
      landmarkBorder: '#FF5500',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(11, 19, 43, 0.88)',
      statsAccent: '#FF5500',
      statsText: '#FFFFFF'
    },
    gradient: ['#00F2FE', '#4FACFE', '#FF5500']
  },
  {
    id: 'berlin',
    name: 'Berlin Marathon',
    category: 'World Major',
    badge: '🇩🇪 BMW Berlin',
    colors: {
      primary: '#00E5C0',      // Berlin Electric Teal
      secondary: '#FFC837',    // Fast Sunburst Gold
      glow: 'rgba(0, 229, 192, 0.5)',
      core: '#FFFFFF',
      startBadge: '#00E5C0',
      finishBadge: '#FFC837',
      landmarkBadge: '#111827',
      landmarkBorder: '#00E5C0',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(17, 24, 39, 0.85)',
      statsAccent: '#00E5C0',
      statsText: '#FFFFFF'
    },
    gradient: ['#FF8008', '#FFC837', '#00E5C0']
  },
  {
    id: 'chicago',
    name: 'Chicago Marathon',
    category: 'World Major',
    badge: '⭐ BofA Chicago',
    colors: {
      primary: '#C8102E',      // Chicago Crimson
      secondary: '#41B6E6',    // Lake Michigan Sky
      glow: 'rgba(200, 16, 46, 0.5)',
      core: '#FFFFFF',
      startBadge: '#41B6E6',
      finishBadge: '#C8102E',
      landmarkBadge: '#0D1B2A',
      landmarkBorder: '#41B6E6',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(13, 27, 42, 0.85)',
      statsAccent: '#C8102E',
      statsText: '#FFFFFF'
    },
    gradient: ['#41B6E6', '#FFFFFF', '#C8102E']
  },
  {
    id: 'tokyo',
    name: 'Tokyo Marathon',
    category: 'World Major',
    badge: '🌸 Tokyo Marathon',
    colors: {
      primary: '#FF5376',      // Sakura Blossom Pink
      secondary: '#E8A838',    // Tokyo Gold
      glow: 'rgba(255, 83, 118, 0.5)',
      core: '#FFF0F5',
      startBadge: '#00E676',
      finishBadge: '#FF5376',
      landmarkBadge: '#240046',
      landmarkBorder: '#FF5376',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(36, 0, 70, 0.85)',
      statsAccent: '#FF5376',
      statsText: '#FFFFFF'
    },
    gradient: ['#7928CA', '#FF5376', '#E8A838']
  },
  {
    id: 'cyberpunk',
    name: 'Midnight Neon',
    category: 'Vibrant Glow',
    badge: '⚡ Neon Cyber',
    colors: {
      primary: '#00F2FE',
      secondary: '#FF007F',
      glow: 'rgba(0, 242, 254, 0.65)',
      core: '#FFFFFF',
      startBadge: '#00F2FE',
      finishBadge: '#FF007F',
      landmarkBadge: '#0F0C20',
      landmarkBorder: '#00F2FE',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(15, 12, 32, 0.88)',
      statsAccent: '#00F2FE',
      statsText: '#FFFFFF'
    },
    gradient: ['#00F2FE', '#7F00FF', '#FF007F']
  },
  {
    id: 'sunset',
    name: 'Sunset Stride',
    category: 'Vibrant Glow',
    badge: '🌅 Golden Hour',
    colors: {
      primary: '#FF4E50',
      secondary: '#F9D423',
      glow: 'rgba(255, 78, 80, 0.5)',
      core: '#FFFFFF',
      startBadge: '#F9D423',
      finishBadge: '#FF4E50',
      landmarkBadge: '#1F1122',
      landmarkBorder: '#FF4E50',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(31, 17, 34, 0.85)',
      statsAccent: '#FF4E50',
      statsText: '#FFFFFF'
    },
    gradient: ['#F9D423', '#FF4E50', '#8A2387']
  },
  {
    id: 'minimal_white',
    name: 'Ultra Minimalist',
    category: 'Clean / Modern',
    badge: '✨ Ghost White',
    colors: {
      primary: '#FFFFFF',
      secondary: '#E2E8F0',
      glow: 'rgba(255, 255, 255, 0.35)',
      core: '#FFFFFF',
      startBadge: '#FFFFFF',
      finishBadge: '#FFFFFF',
      landmarkBadge: 'rgba(20, 20, 25, 0.85)',
      landmarkBorder: '#FFFFFF',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(20, 20, 25, 0.85)',
      statsAccent: '#FFFFFF',
      statsText: '#FFFFFF'
    },
    gradient: ['#94A3B8', '#E2E8F0', '#FFFFFF']
  },
  {
    id: 'emerald',
    name: 'Emerald Trail',
    category: 'Clean / Modern',
    badge: '🌲 Forest Trail',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      glow: 'rgba(16, 185, 129, 0.5)',
      core: '#ECFDF5',
      startBadge: '#34D399',
      finishBadge: '#10B981',
      landmarkBadge: '#064E3B',
      landmarkBorder: '#34D399',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(6, 78, 59, 0.85)',
      statsAccent: '#34D399',
      statsText: '#FFFFFF'
    },
    gradient: ['#047857', '#10B981', '#6EE7B7']
  }
];

// Rich Catalog of National Flag Themes for Marathon Host Countries
const COUNTRY_THEMES = [
  {
    id: 'country_us',
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    category: 'Country Flag',
    badge: '🇺🇸 United States',
    colors: {
      primary: '#B22234',      // Old Glory Red
      secondary: '#3C3B6E',    // Old Glory Blue
      glow: 'rgba(178, 34, 52, 0.55)',
      core: '#FFFFFF',
      startBadge: '#3C3B6E',
      finishBadge: '#B22234',
      landmarkBadge: '#0D1527',
      landmarkBorder: '#3C3B6E',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(13, 21, 39, 0.88)',
      statsAccent: '#B22234',
      statsText: '#FFFFFF'
    },
    gradient: ['#3C3B6E', '#FFFFFF', '#B22234']
  },
  {
    id: 'country_gb',
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    category: 'Country Flag',
    badge: '🇬🇧 United Kingdom',
    colors: {
      primary: '#C8102E',      // Union Jack Red
      secondary: '#012169',    // Royal Navy Blue
      glow: 'rgba(200, 16, 46, 0.55)',
      core: '#FFFFFF',
      startBadge: '#012169',
      finishBadge: '#C8102E',
      landmarkBadge: '#0A1325',
      landmarkBorder: '#012169',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(10, 19, 37, 0.88)',
      statsAccent: '#C8102E',
      statsText: '#FFFFFF'
    },
    gradient: ['#012169', '#FFFFFF', '#C8102E']
  },
  {
    id: 'country_ke',
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    category: 'Country Flag',
    badge: '🇰🇪 Kenya',
    colors: {
      primary: '#BB0000',      // Kenya Red
      secondary: '#006600',    // Rift Valley Green
      glow: 'rgba(187, 0, 0, 0.55)',
      core: '#FFFFFF',
      startBadge: '#1A1A1A',
      finishBadge: '#006600',
      landmarkBadge: '#141812',
      landmarkBorder: '#BB0000',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(20, 24, 18, 0.88)',
      statsAccent: '#006600',
      statsText: '#FFFFFF'
    },
    gradient: ['#1A1A1A', '#BB0000', '#FFFFFF', '#006600']
  },
  {
    id: 'country_jp',
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    category: 'Country Flag',
    badge: '🇯🇵 Japan',
    colors: {
      primary: '#BC002D',      // Crimson Sun
      secondary: '#FFFFFF',    // Pure White
      glow: 'rgba(188, 0, 45, 0.55)',
      core: '#FFFFFF',
      startBadge: '#FFFFFF',
      finishBadge: '#BC002D',
      landmarkBadge: '#22080E',
      landmarkBorder: '#BC002D',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(34, 8, 14, 0.88)',
      statsAccent: '#BC002D',
      statsText: '#FFFFFF'
    },
    gradient: ['#FFFFFF', '#BC002D', '#FFFFFF', '#BC002D']
  },
  {
    id: 'country_fr',
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    category: 'Country Flag',
    badge: '🇫🇷 France',
    colors: {
      primary: '#ED2939',      // Rouge Tricolore
      secondary: '#002654',    // Bleu Tricolore
      glow: 'rgba(237, 41, 57, 0.55)',
      core: '#FFFFFF',
      startBadge: '#002654',
      finishBadge: '#ED2939',
      landmarkBadge: '#081226',
      landmarkBorder: '#002654',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(8, 18, 38, 0.88)',
      statsAccent: '#ED2939',
      statsText: '#FFFFFF'
    },
    gradient: ['#002654', '#FFFFFF', '#ED2939']
  },
  {
    id: 'country_de',
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    category: 'Country Flag',
    badge: '🇩🇪 Germany',
    colors: {
      primary: '#DD0000',      // German Red
      secondary: '#FFCE00',    // German Gold
      glow: 'rgba(221, 0, 0, 0.55)',
      core: '#FFCE00',
      startBadge: '#1A1A1A',
      finishBadge: '#FFCE00',
      landmarkBadge: '#181206',
      landmarkBorder: '#DD0000',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(24, 18, 6, 0.88)',
      statsAccent: '#FFCE00',
      statsText: '#FFFFFF'
    },
    gradient: ['#1A1A1A', '#DD0000', '#FFCE00']
  },
  {
    id: 'country_it',
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    category: 'Country Flag',
    badge: '🇮🇹 Italy',
    colors: {
      primary: '#CE2B37',      // Scarlet Red
      secondary: '#009246',    // Tricolore Green
      glow: 'rgba(0, 146, 70, 0.55)',
      core: '#FFFFFF',
      startBadge: '#009246',
      finishBadge: '#CE2B37',
      landmarkBadge: '#0B1E12',
      landmarkBorder: '#009246',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(11, 30, 18, 0.88)',
      statsAccent: '#CE2B37',
      statsText: '#FFFFFF'
    },
    gradient: ['#009246', '#FFFFFF', '#CE2B37']
  },
  {
    id: 'country_es',
    code: 'ES',
    name: 'Spain',
    flag: '🇪🇸',
    category: 'Country Flag',
    badge: '🇪🇸 Spain',
    colors: {
      primary: '#AA151B',      // Spanish Red
      secondary: '#F1BF00',    // Spanish Gold / Yellow
      glow: 'rgba(241, 191, 0, 0.6)',
      core: '#FFF2B2',
      startBadge: '#AA151B',
      finishBadge: '#F1BF00',
      landmarkBadge: '#260B0C',
      landmarkBorder: '#F1BF00',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(38, 11, 12, 0.88)',
      statsAccent: '#F1BF00',
      statsText: '#FFFFFF'
    },
    gradient: ['#AA151B', '#F1BF00', '#AA151B']
  },
  {
    id: 'country_et',
    code: 'ET',
    name: 'Ethiopia',
    flag: '🇪🇹',
    category: 'Country Flag',
    badge: '🇪🇹 Ethiopia',
    colors: {
      primary: '#009A44',      // Abyssinian Green
      secondary: '#FED100',    // Golden Yellow
      glow: 'rgba(254, 209, 0, 0.55)',
      core: '#FFFFFF',
      startBadge: '#009A44',
      finishBadge: '#EF3340',
      landmarkBadge: '#0E1D13',
      landmarkBorder: '#FED100',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(14, 29, 19, 0.88)',
      statsAccent: '#FED100',
      statsText: '#FFFFFF'
    },
    gradient: ['#009A44', '#FED100', '#EF3340']
  },
  {
    id: 'country_br',
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    category: 'Country Flag',
    badge: '🇧🇷 Brazil',
    colors: {
      primary: '#009B3A',      // Amazon Green
      secondary: '#FEDF00',    // Solar Yellow
      glow: 'rgba(0, 155, 58, 0.55)',
      core: '#FFFFFF',
      startBadge: '#009B3A',
      finishBadge: '#002776',
      landmarkBadge: '#061D0F',
      landmarkBorder: '#FEDF00',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(6, 29, 15, 0.88)',
      statsAccent: '#FEDF00',
      statsText: '#FFFFFF'
    },
    gradient: ['#009B3A', '#FEDF00', '#002776']
  },
  {
    id: 'country_ca',
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    category: 'Country Flag',
    badge: '🇨🇦 Canada',
    colors: {
      primary: '#D80621',      // Maple Leaf Red
      secondary: '#FFFFFF',    // Pure White
      glow: 'rgba(216, 6, 33, 0.55)',
      core: '#FFFFFF',
      startBadge: '#D80621',
      finishBadge: '#FFFFFF',
      landmarkBadge: '#26060A',
      landmarkBorder: '#D80621',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(38, 6, 10, 0.88)',
      statsAccent: '#D80621',
      statsText: '#FFFFFF'
    },
    gradient: ['#D80621', '#FFFFFF', '#D80621']
  },
  {
    id: 'country_au',
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    category: 'Country Flag',
    badge: '🇦🇺 Australia',
    colors: {
      primary: '#00843D',      // Aussie Green
      secondary: '#FFCD00',    // Aussie Gold
      glow: 'rgba(255, 205, 0, 0.55)',
      core: '#FFFFFF',
      startBadge: '#00843D',
      finishBadge: '#FFCD00',
      landmarkBadge: '#071F11',
      landmarkBorder: '#FFCD00',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(7, 31, 17, 0.88)',
      statsAccent: '#FFCD00',
      statsText: '#FFFFFF'
    },
    gradient: ['#00843D', '#FFCD00', '#002B49']
  },
  {
    id: 'country_nl',
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    category: 'Country Flag',
    badge: '🇳🇱 Netherlands',
    colors: {
      primary: '#FF4F00',      // Dutch Oranje
      secondary: '#21468B',    // Cobalt Blue
      glow: 'rgba(255, 79, 0, 0.55)',
      core: '#FFFFFF',
      startBadge: '#FF4F00',
      finishBadge: '#21468B',
      landmarkBadge: '#1D120B',
      landmarkBorder: '#FF4F00',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(29, 18, 11, 0.88)',
      statsAccent: '#FF4F00',
      statsText: '#FFFFFF'
    },
    gradient: ['#AE1C28', '#FFFFFF', '#21468B', '#FF4F00']
  },
  {
    id: 'country_ie',
    code: 'IE',
    name: 'Ireland',
    flag: '🇮🇪',
    category: 'Country Flag',
    badge: '🇮🇪 Ireland',
    colors: {
      primary: '#169B62',      // Emerald Green
      secondary: '#FF883E',    // Irish Orange
      glow: 'rgba(22, 155, 98, 0.55)',
      core: '#FFFFFF',
      startBadge: '#169B62',
      finishBadge: '#FF883E',
      landmarkBadge: '#081D14',
      landmarkBorder: '#169B62',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(8, 29, 20, 0.88)',
      statsAccent: '#FF883E',
      statsText: '#FFFFFF'
    },
    gradient: ['#169B62', '#FFFFFF', '#FF883E']
  },
  {
    id: 'country_mx',
    code: 'MX',
    name: 'Mexico',
    flag: '🇲🇽',
    category: 'Country Flag',
    badge: '🇲🇽 Mexico',
    colors: {
      primary: '#006847',      // Aztec Green
      secondary: '#CE1126',    // Mexican Red
      glow: 'rgba(0, 104, 71, 0.55)',
      core: '#FFFFFF',
      startBadge: '#006847',
      finishBadge: '#CE1126',
      landmarkBadge: '#061D15',
      landmarkBorder: '#006847',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(6, 29, 21, 0.88)',
      statsAccent: '#CE1126',
      statsText: '#FFFFFF'
    },
    gradient: ['#006847', '#FFFFFF', '#CE1126']
  },
  {
    id: 'country_za',
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    category: 'Country Flag',
    badge: '🇿🇦 South Africa',
    colors: {
      primary: '#007749',      // National Green
      secondary: '#FFB612',    // Gold
      glow: 'rgba(0, 119, 73, 0.55)',
      core: '#FFFFFF',
      startBadge: '#007749',
      finishBadge: '#E03C31',
      landmarkBadge: '#071E14',
      landmarkBorder: '#FFB612',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(7, 30, 20, 0.88)',
      statsAccent: '#FFB612',
      statsText: '#FFFFFF'
    },
    gradient: ['#007749', '#FFB612', '#E03C31', '#001489']
  },
  {
    id: 'country_ch',
    code: 'CH',
    name: 'Switzerland',
    flag: '🇨🇭',
    category: 'Country Flag',
    badge: '🇨🇭 Switzerland',
    colors: {
      primary: '#DA291C',      // Swiss Alpine Red
      secondary: '#FFFFFF',    // Swiss White Cross
      glow: 'rgba(218, 41, 28, 0.55)',
      core: '#FFFFFF',
      startBadge: '#DA291C',
      finishBadge: '#FFFFFF',
      landmarkBadge: '#260A08',
      landmarkBorder: '#DA291C',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(38, 10, 8, 0.88)',
      statsAccent: '#DA291C',
      statsText: '#FFFFFF'
    },
    gradient: ['#DA291C', '#FFFFFF', '#DA291C']
  },
  {
    id: 'country_se',
    code: 'SE',
    name: 'Sweden',
    flag: '🇸🇪',
    category: 'Country Flag',
    badge: '🇸🇪 Sweden',
    colors: {
      primary: '#006AA7',      // Swedish Blue
      secondary: '#FECC00',    // Sunburst Yellow
      glow: 'rgba(254, 204, 0, 0.55)',
      core: '#FFF7CC',
      startBadge: '#006AA7',
      finishBadge: '#FECC00',
      landmarkBadge: '#071824',
      landmarkBorder: '#FECC00',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(7, 24, 36, 0.88)',
      statsAccent: '#FECC00',
      statsText: '#FFFFFF'
    },
    gradient: ['#006AA7', '#FECC00', '#006AA7']
  },
  {
    id: 'country_no',
    code: 'NO',
    name: 'Norway',
    flag: '🇳🇴',
    category: 'Country Flag',
    badge: '🇳🇴 Norway',
    colors: {
      primary: '#BA0C2F',      // Nordic Red
      secondary: '#00205B',    // Dark Navy
      glow: 'rgba(186, 12, 47, 0.55)',
      core: '#FFFFFF',
      startBadge: '#00205B',
      finishBadge: '#BA0C2F',
      landmarkBadge: '#1F0B11',
      landmarkBorder: '#BA0C2F',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(31, 11, 17, 0.88)',
      statsAccent: '#BA0C2F',
      statsText: '#FFFFFF'
    },
    gradient: ['#BA0C2F', '#FFFFFF', '#00205B', '#BA0C2F']
  },
  {
    id: 'country_gr',
    code: 'GR',
    name: 'Greece',
    flag: '🇬🇷',
    category: 'Country Flag',
    badge: '🇬🇷 Greece (Birthplace of Marathon)',
    colors: {
      primary: '#0D5EAF',      // Aegean Blue
      secondary: '#FFFFFF',    // Olympus White
      glow: 'rgba(13, 94, 175, 0.55)',
      core: '#FFFFFF',
      startBadge: '#0D5EAF',
      finishBadge: '#FFFFFF',
      landmarkBadge: '#081726',
      landmarkBorder: '#0D5EAF',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(8, 23, 38, 0.88)',
      statsAccent: '#0D5EAF',
      statsText: '#FFFFFF'
    },
    gradient: ['#0D5EAF', '#FFFFFF', '#0D5EAF', '#FFFFFF', '#0D5EAF']
  },
  {
    id: 'country_at',
    code: 'AT',
    name: 'Austria',
    flag: '🇦🇹',
    category: 'Country Flag',
    badge: '🇦🇹 Austria',
    colors: {
      primary: '#ED2939',      // Austrian Red
      secondary: '#FFFFFF',    // Snow White
      glow: 'rgba(237, 41, 57, 0.55)',
      core: '#FFFFFF',
      startBadge: '#ED2939',
      finishBadge: '#FFFFFF',
      landmarkBadge: '#260B0E',
      landmarkBorder: '#ED2939',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(38, 11, 14, 0.88)',
      statsAccent: '#ED2939',
      statsText: '#FFFFFF'
    },
    gradient: ['#ED2939', '#FFFFFF', '#ED2939']
  },
  {
    id: 'country_pt',
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    category: 'Country Flag',
    badge: '🇵🇹 Portugal',
    colors: {
      primary: '#FF0000',      // Scarlet Red
      secondary: '#006600',    // Atlantic Green
      glow: 'rgba(255, 0, 0, 0.55)',
      core: '#FFCC00',
      startBadge: '#006600',
      finishBadge: '#FF0000',
      landmarkBadge: '#1D1107',
      landmarkBorder: '#FFCC00',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(29, 17, 7, 0.88)',
      statsAccent: '#FFCC00',
      statsText: '#FFFFFF'
    },
    gradient: ['#006600', '#FFCC00', '#FF0000']
  },
  {
    id: 'country_be',
    code: 'BE',
    name: 'Belgium',
    flag: '🇧🇪',
    category: 'Country Flag',
    badge: '🇧🇪 Belgium',
    colors: {
      primary: '#EF3340',      // Red
      secondary: '#FFD100',    // Yellow
      glow: 'rgba(239, 51, 64, 0.55)',
      core: '#FFD100',
      startBadge: '#111111',
      finishBadge: '#EF3340',
      landmarkBadge: '#1C1608',
      landmarkBorder: '#FFD100',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(28, 22, 8, 0.88)',
      statsAccent: '#FFD100',
      statsText: '#FFFFFF'
    },
    gradient: ['#111111', '#FFD100', '#EF3340']
  },
  {
    id: 'country_dk',
    code: 'DK',
    name: 'Denmark',
    flag: '🇩🇰',
    category: 'Country Flag',
    badge: '🇩🇰 Denmark',
    colors: {
      primary: '#C8102E',      // Dannebrog Red
      secondary: '#FFFFFF',    // White
      glow: 'rgba(200, 16, 46, 0.55)',
      core: '#FFFFFF',
      startBadge: '#C8102E',
      finishBadge: '#FFFFFF',
      landmarkBadge: '#22080D',
      landmarkBorder: '#C8102E',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(34, 8, 13, 0.88)',
      statsAccent: '#C8102E',
      statsText: '#FFFFFF'
    },
    gradient: ['#C8102E', '#FFFFFF', '#C8102E']
  },
  {
    id: 'country_fi',
    code: 'FI',
    name: 'Finland',
    flag: '🇫🇮',
    category: 'Country Flag',
    badge: '🇫🇮 Finland',
    colors: {
      primary: '#002F6C',      // Suomi Deep Blue
      secondary: '#FFFFFF',    // White
      glow: 'rgba(0, 47, 108, 0.55)',
      core: '#FFFFFF',
      startBadge: '#002F6C',
      finishBadge: '#FFFFFF',
      landmarkBadge: '#081424',
      landmarkBorder: '#002F6C',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(8, 20, 36, 0.88)',
      statsAccent: '#002F6C',
      statsText: '#FFFFFF'
    },
    gradient: ['#FFFFFF', '#002F6C', '#FFFFFF']
  },
  {
    id: 'country_pl',
    code: 'PL',
    name: 'Poland',
    flag: '🇵🇱',
    category: 'Country Flag',
    badge: '🇵🇱 Poland',
    colors: {
      primary: '#DC143C',      // Polish Crimson
      secondary: '#FFFFFF',    // White
      glow: 'rgba(220, 20, 60, 0.55)',
      core: '#FFFFFF',
      startBadge: '#FFFFFF',
      finishBadge: '#DC143C',
      landmarkBadge: '#22080E',
      landmarkBorder: '#DC143C',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(34, 8, 14, 0.88)',
      statsAccent: '#DC143C',
      statsText: '#FFFFFF'
    },
    gradient: ['#FFFFFF', '#DC143C']
  },
  {
    id: 'country_jm',
    code: 'JM',
    name: 'Jamaica',
    flag: '🇯🇲',
    category: 'Country Flag',
    badge: '🇯🇲 Jamaica',
    colors: {
      primary: '#009B3A',      // Green
      secondary: '#FED100',    // Gold
      glow: 'rgba(254, 209, 0, 0.55)',
      core: '#FFFFFF',
      startBadge: '#009B3A',
      finishBadge: '#FED100',
      landmarkBadge: '#181507',
      landmarkBorder: '#FED100',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(24, 21, 7, 0.88)',
      statsAccent: '#FED100',
      statsText: '#FFFFFF'
    },
    gradient: ['#009B3A', '#FED100', '#111111']
  },
  {
    id: 'country_co',
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    category: 'Country Flag',
    badge: '🇨🇴 Colombia',
    colors: {
      primary: '#FCD116',      // Golden Yellow
      secondary: '#003893',    // Blue
      glow: 'rgba(252, 209, 22, 0.55)',
      core: '#FFFBEA',
      startBadge: '#FCD116',
      finishBadge: '#CE1126',
      landmarkBadge: '#221B08',
      landmarkBorder: '#FCD116',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(34, 27, 8, 0.88)',
      statsAccent: '#FCD116',
      statsText: '#FFFFFF'
    },
    gradient: ['#FCD116', '#003893', '#CE1126']
  },
  {
    id: 'country_ar',
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    category: 'Country Flag',
    badge: '🇦🇷 Argentina',
    colors: {
      primary: '#74ACDF',      // Celestial Blue
      secondary: '#F6B40E',    // Sun of May Gold
      glow: 'rgba(116, 172, 223, 0.55)',
      core: '#FFFFFF',
      startBadge: '#74ACDF',
      finishBadge: '#F6B40E',
      landmarkBadge: '#0E1925',
      landmarkBorder: '#74ACDF',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(14, 25, 37, 0.88)',
      statsAccent: '#F6B40E',
      statsText: '#FFFFFF'
    },
    gradient: ['#74ACDF', '#FFFFFF', '#F6B40E', '#74ACDF']
  },
  {
    id: 'country_kr',
    code: 'KR',
    name: 'South Korea',
    flag: '🇰🇷',
    category: 'Country Flag',
    badge: '🇰🇷 South Korea',
    colors: {
      primary: '#CD2E3A',      // Taegeuk Red
      secondary: '#0047A0',    // Taegeuk Blue
      glow: 'rgba(205, 46, 58, 0.55)',
      core: '#FFFFFF',
      startBadge: '#0047A0',
      finishBadge: '#CD2E3A',
      landmarkBadge: '#1A0C16',
      landmarkBorder: '#CD2E3A',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(26, 12, 22, 0.88)',
      statsAccent: '#0047A0',
      statsText: '#FFFFFF'
    },
    gradient: ['#0047A0', '#FFFFFF', '#CD2E3A']
  },
  {
    id: 'country_sg',
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    category: 'Country Flag',
    badge: '🇸🇬 Singapore',
    colors: {
      primary: '#ED2939',      // Red
      secondary: '#FFFFFF',    // White
      glow: 'rgba(237, 41, 57, 0.55)',
      core: '#FFFFFF',
      startBadge: '#ED2939',
      finishBadge: '#FFFFFF',
      landmarkBadge: '#22080E',
      landmarkBorder: '#ED2939',
      landmarkText: '#FFFFFF',
      statsBg: 'rgba(34, 8, 14, 0.88)',
      statsAccent: '#ED2939',
      statsText: '#FFFFFF'
    },
    gradient: ['#ED2939', '#FFFFFF']
  }
];

// Sample Marathon Catalog with URLs to local sample files
const SAMPLE_MARATHONS = [
  {
    id: 'sample_london',
    name: 'London Marathon 2026',
    file: 'sample_data/london_marathon.gpx',
    themeId: 'london',
    countryCode: 'GB',
    city: 'London, UK',
    description: 'Iconic course crossing Tower Bridge, Canary Wharf & finishing at The Mall.',
    runner: {
      name: 'Alex Morgan',
      bib: 'BIB 14920',
      timeOverride: '3:24:18',
      distanceOverride: '42.2 KM'
    }
  },
  {
    id: 'sample_boston',
    name: 'Boston Marathon 130th',
    file: 'sample_data/boston_marathon.gpx',
    themeId: 'boston',
    countryCode: 'US',
    city: 'Boston, USA',
    description: 'From Hopkinton past Wellesley Scream Tunnel and Heartbreak Hill to Boylston.',
    runner: {
      name: 'Jordan Reed',
      bib: 'BIB 3042',
      timeOverride: '3:12:45',
      distanceOverride: '26.2 MI'
    }
  },
  {
    id: 'sample_nyc',
    name: 'TCS New York City Marathon',
    file: 'sample_data/nyc_marathon.gpx',
    themeId: 'nyc',
    countryCode: 'US',
    city: 'New York, USA',
    description: 'Running through all five boroughs from Staten Island to Central Park.',
    runner: {
      name: 'Taylor Brooks',
      bib: 'BIB 28941',
      timeOverride: '3:39:10',
      distanceOverride: '26.2 MI'
    }
  },
  {
    id: 'sample_buenos_aires',
    name: 'Maratón de Buenos Aires',
    file: 'sample_data/buenos_aires_marathon.gpx',
    themeId: 'country_ar',
    countryCode: 'AR',
    city: 'Buenos Aires, Argentina',
    description: 'Fast course through Palermo, Av. 9 de Julio past the Obelisco, Plaza de Mayo & Puerto Madero.',
    runner: {
      name: 'Mateo Rossi',
      bib: 'BIB 5120',
      timeOverride: '3:18:22',
      distanceOverride: '42.2 KM'
    }
  }
];

window.RACE_THEMES = RACE_THEMES;
window.COUNTRY_THEMES = COUNTRY_THEMES;
window.SAMPLE_MARATHONS = SAMPLE_MARATHONS;
