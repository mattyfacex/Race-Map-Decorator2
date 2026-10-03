import math
import datetime
import html

# Detailed course path coordinates for London Marathon (Start in Greenwich, loop Woolwich, Cutty Sark, Surrey Quays loop, Tower Bridge, Isle of Dogs / Canary Wharf loop, Thames Embankment, Big Ben, The Mall)
LONDON_COURSE = [
    (51.4728, 0.0075, 45),   # 0: Greenwich Park / Blackheath Start
    (51.4820, 0.0250, 42),   # Charlton Way
    (51.4890, 0.0580, 22),   # East to Woolwich
    (51.4895, 0.0680, 16),   # Royal Artillery Barracks Woolwich (Mile 3)
    (51.4850, 0.0520, 18),   # Turn west onto Woolwich Rd
    (51.4870, 0.0150, 14),   # Charlton
    (51.4828, -0.0098, 12),  # Cutty Sark Greenwich (Mile 6.5)
    (51.4810, -0.0240, 9),   # Deptford Creek
    (51.4890, -0.0380, 7),   # Evelyn Street
    (51.4984, -0.0468, 6),   # Surrey Quays (Mile 9)
    (51.5060, -0.0380, 5),   # Rotherhithe docklands north loop
    (51.5040, -0.0550, 6),   # Brunel Road
    (51.5000, -0.0620, 8),   # Jamaica Road
    (51.5055, -0.0754, 18),  # Tower Bridge Crossing (Halfway - 21.1 km)
    (51.5110, -0.0600, 12),  # East onto The Highway
    (51.5120, -0.0400, 9),   # Limehouse
    (51.5090, -0.0250, 8),   # Westferry Rd into Isle of Dogs
    (51.4920, -0.0180, 6),   # Mudchute / Island Gardens south loop (Mile 16)
    (51.4980, -0.0090, 7),   # East Ferry Rd
    (51.5033, -0.0189, 8),   # Canary Wharf skyscrapers (Mile 19)
    (51.5130, -0.0190, 10),  # Poplar High Street
    (51.5110, -0.0500, 11),  # Heading west back on The Highway
    (51.5081, -0.0759, 14),  # Tower of London (Mile 22.5)
    (51.5095, -0.0950, 12),  # Lower Thames Street / Blackfriars
    (51.5113, -0.1160, 11),  # Victoria Embankment along the Thames curve (Mile 24)
    (51.5040, -0.1220, 12),  # Approaching Westminster
    (51.5007, -0.1246, 12),  # Big Ben & Parliament Square (Mile 25.5)
    (51.5015, -0.1330, 14),  # Great George St & Birdcage Walk
    (51.5018, -0.1415, 15),  # Spur Road / Buckingham Palace
    (51.5044, -0.1365, 15),  # Finish: The Mall & Palace
]

LONDON_LANDMARKS = [
    (51.4728, 0.0075, 45, "Start: Greenwich Park", "flag_start"),
    (51.4828, -0.0098, 12, "Cutty Sark (Mile 6.5)", "ship"),
    (51.4984, -0.0468, 6, "Surrey Quays", "water"),
    (51.5055, -0.0754, 18, "Tower Bridge (Halfway!)", "bridge"),
    (51.5033, -0.0189, 8, "Canary Wharf (Mile 19)", "buildings"),
    (51.5081, -0.0759, 14, "Tower of London (Mile 22.5)", "castle"),
    (51.5113, -0.1160, 11, "Victoria Embankment", "landmark"),
    (51.5007, -0.1246, 12, "Big Ben & Westminster (Mile 25.5)", "clock"),
    (51.5044, -0.1365, 15, "Finish: The Mall & Palace", "flag_finish"),
]

# Detailed course path coordinates for Boston Marathon (Hopkinton to Boylston Street)
BOSTON_COURSE = [
    (42.2286, -71.5235, 145), # Hopkinton Start
    (42.2380, -71.4950, 110), # Hayden Rowe St
    (42.2572, -71.4647, 85),  # Ashland (Mile 3)
    (42.2680, -71.4390, 70),  # Union Ave
    (42.2778, -71.4172, 60),  # Framingham Depot (Mile 6.7)
    (42.2810, -71.3850, 56),  # Route 135
    (42.2858, -71.3503, 52),  # Natick Center (Mile 10.2)
    (42.2900, -71.3150, 48),  # Central Street
    (42.2965, -71.2917, 44),  # Wellesley College & Scream Tunnel (Halfway)
    (42.3080, -71.2650, 46),  # Wellesley Hills
    (42.3210, -71.2450, 32),  # Route 16 Lower Falls
    (42.3380, -71.2330, 40),  # Newton Firehouse turn onto Comm Ave (Mile 17.5)
    (42.3375, -71.2150, 55),  # First Newton Hill
    (42.3364, -71.1925, 71),  # Heartbreak Hill summit (Mile 20.5)
    (42.3385, -71.1689, 45),  # Boston College (Mile 21.5)
    (42.3360, -71.1500, 30),  # Cleveland Circle
    (42.3420, -71.1210, 22),  # Coolidge Corner Brookline (Mile 24)
    (42.3489, -71.0978, 8),   # Kenmore Square / Citgo Sign (Mile 25)
    (42.3505, -71.0880, 7),   # Commonwealth Ave underpass
    (42.3490, -71.0825, 6),   # Hereford St turn
    (42.3498, -71.0776, 5),   # Boylston St Finish in Copley Square
]

BOSTON_LANDMARKS = [
    (42.2286, -71.5235, 145, "Start: Hopkinton", "flag_start"),
    (42.2572, -71.4647, 85, "Ashland (Mile 3)", "cheer"),
    (42.2778, -71.4172, 60, "Framingham (Mile 6.7)", "landmark"),
    (42.2858, -71.3503, 52, "Natick (Mile 10.2)", "beer"),
    (42.2965, -71.2917, 44, "Wellesley Scream Tunnel (Halfway)", "heart"),
    (42.3364, -71.1925, 71, "Heartbreak Hill (Mile 20.5)", "mountain"),
    (42.3385, -71.1689, 45, "Boston College (Mile 21.5)", "trophy"),
    (42.3489, -71.0978, 8, "Citgo Sign / Kenmore Sq (Mile 25)", "star"),
    (42.3498, -71.0776, 5, "Finish: Boylston St", "flag_finish"),
]

# Detailed course path coordinates for New York City Marathon (All 5 Boroughs)
NYC_COURSE = [
    (40.6062, -74.0447, 65),  # Verrazzano-Narrows Bridge Start
    (40.6150, -74.0320, 35),  # Bridge descent into Brooklyn
    (40.6280, -74.0280, 22),  # Bay Ridge 4th Ave
    (40.6450, -74.0150, 18),  # 4th Ave Sunset Park
    (40.6650, -73.9950, 25),  # 4th Ave Gowanus
    (40.6812, -73.9785, 35),  # Barclays Center Atlantic Ave (Mile 8)
    (40.6880, -73.9650, 28),  # Lafayette Ave Clinton Hill
    (40.6970, -73.9570, 20),  # Bedford Ave
    (40.7180, -73.9520, 12),  # Williamsburg (Mile 11)
    (40.7300, -73.9540, 14),  # Greenpoint Manhattan Ave
    (40.7420, -73.9535, 25),  # Pulaski Bridge into Queens (Halfway!)
    (40.7490, -73.9480, 18),  # Long Island City 44th Dr
    (40.7570, -73.9540, 40),  # Queensboro Bridge climb (Mile 15.5)
    (40.7630, -73.9600, 25),  # Exit bridge into Manhattan
    (40.7720, -73.9540, 22),  # 1st Avenue Upper East Side (Mile 17)
    (40.7950, -73.9380, 18),  # 1st Avenue East Harlem
    (40.8120, -73.9280, 15),  # Willis Ave Bridge into The Bronx (Mile 20)
    (40.8110, -73.9230, 14),  # 138th St Bronx loop
    (40.8100, -73.9360, 16),  # Madison Ave Bridge back to Manhattan
    (40.8000, -73.9450, 24),  # 5th Avenue south through Harlem (Mile 22)
    (40.7850, -73.9600, 32),  # Engineer's Gate enter Central Park
    (40.7720, -73.9700, 35),  # Central Park East Drive hills
    (40.7640, -73.9740, 28),  # Exit to Central Park South (59th St)
    (40.7660, -73.9780, 26),  # Central Park South crowd (Mile 25.5)
    (40.7680, -73.9810, 28),  # Columbus Circle re-enter park
    (40.7711, -73.9742, 30),  # Central Park West Finish
]

NYC_LANDMARKS = [
    (40.6062, -74.0447, 65, "Start: Verrazzano-Narrows Bridge", "flag_start"),
    (40.6350, -74.0260, 20, "Bay Ridge 4th Ave (Mile 4)", "cheer"),
    (40.6812, -73.9785, 35, "Barclays Center Brooklyn (Mile 8)", "landmark"),
    (40.7180, -73.9520, 12, "Williamsburg / Greenpoint", "camera"),
    (40.7420, -73.9535, 25, "Pulaski Bridge (Halfway!)", "bridge"),
    (40.7570, -73.9540, 40, "Queensboro Bridge (Mile 15.5)", "bridge"),
    (40.7850, -73.9510, 22, "First Avenue Crowd (Mile 18)", "music"),
    (40.8120, -73.9280, 15, "The Bronx (Mile 20)", "crown"),
    (40.7711, -73.9742, 30, "Finish: Central Park West", "flag_finish"),
]

def catmull_rom_spline(p0, p1, p2, p3, t):
    """Catmull-Rom spline interpolation for smooth realistic running GPS paths"""
    t2 = t * t
    t3 = t2 * t
    
    def calc(v0, v1, v2, v3):
        return 0.5 * (
            (2 * v1) +
            (-v0 + v2) * t +
            (2 * v0 - 5 * v1 + 4 * v2 - v3) * t2 +
            (-v0 + 3 * v1 - 3 * v2 + v3) * t3
        )
    
    lat = calc(p0[0], p1[0], p2[0], p3[0])
    lon = calc(p0[1], p1[1], p2[1], p3[1])
    ele = calc(p0[2], p1[2], p2[2], p3[2])
    return lat, lon, ele

def generate_smooth_track(key_points, total_points=700):
    """Interpolates realistic course waypoints with smooth Catmull-Rom splines"""
    # Pad ends
    padded = [key_points[0]] + list(key_points) + [key_points[-1]]
    num_segs = len(key_points) - 1
    pts_per_seg = total_points // num_segs
    
    track = []
    current_time = datetime.datetime(2026, 4, 21, 9, 30, 0)
    
    for i in range(num_segs):
        p0 = padded[i]
        p1 = padded[i + 1]
        p2 = padded[i + 2]
        p3 = padded[i + 3]
        
        seg_count = pts_per_seg if i < num_segs - 1 else (total_points - len(track))
        for s in range(seg_count):
            t = s / float(seg_count)
            lat, lon, ele = catmull_rom_spline(p0, p1, p2, p3, t)
            
            # Subtle micro-jitter simulating smartwatch GPS accuracy (+- 2 meters)
            jitter_lat = math.sin(s * 0.7) * 0.00003
            jitter_lon = math.cos(s * 0.5) * 0.00003
            lat += jitter_lat
            lon += jitter_lon
            
            current_time += datetime.timedelta(seconds=17.5)
            time_str = current_time.strftime("%Y-%m-%dT%H:%M:%SZ")
            track.append((lat, lon, ele, time_str))
            
    return track

def write_gpx(filename, race_name, landmarks, track):
    with open(filename, "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<gpx version="1.1" creator="StrataRoute-RaceMap" xmlns="http://www.topografix.com/GPX/1/1">\n')
        f.write(f'  <metadata>\n    <name>{html.escape(race_name)}</name>\n    <time>{track[0][3]}</time>\n  </metadata>\n')
        
        # Waypoints for landmarks
        for wp in landmarks:
            f.write(f'  <wpt lat="{wp[0]:.6f}" lon="{wp[1]:.6f}">\n')
            f.write(f'    <ele>{wp[2]:.1f}</ele>\n')
            f.write(f'    <name>{html.escape(wp[3])}</name>\n')
            f.write(f'    <sym>{html.escape(wp[4])}</sym>\n')
            f.write(f'  </wpt>\n')
            
        f.write('  <trk>\n')
        f.write(f'    <name>{html.escape(race_name)}</name>\n')
        f.write('    <type>running</type>\n')
        f.write('    <trkseg>\n')
        for pt in track:
            f.write(f'      <trkpt lat="{pt[0]:.6f}" lon="{pt[1]:.6f}">\n')
            f.write(f'        <ele>{pt[2]:.1f}</ele>\n')
            f.write(f'        <time>{pt[3]}</time>\n')
            f.write('      </trkpt>\n')
        f.write('    </trkseg>\n')
        f.write('  </trk>\n')
        f.write('</gpx>\n')

# Detailed course path coordinates for Buenos Aires Marathon (Palermo, Retiro, 9 de Julio, Obelisco, Plaza de Mayo, La Boca, Puerto Madero, Costanera Norte)
BUENOS_AIRES_COURSE = [
    (-34.5450, -58.4480, 12),  # Av. Figueroa Alcorta & Monroe (Belgrano Start)
    (-34.5560, -58.4320, 10),  # Av. del Libertador & Hipódromo de Palermo
    (-34.5700, -58.4110, 8),   # Planetario Galileo Galilei (Mile 3)
    (-34.5828, -58.3912, 11),  # Floralis Genérica & Facultad de Derecho
    (-34.5910, -58.3750, 14),  # Retiro / Plaza San Martín
    (-34.5950, -58.3820, 16),  # Avenida 9 de Julio turn
    (-34.6037, -58.3816, 18),  # Obelisco de Buenos Aires & Corrientes (Mile 7 / KM 11)
    (-34.6080, -58.3705, 14),  # Plaza de Mayo & Casa Rosada (Mile 9)
    (-34.6200, -58.3710, 12),  # San Telmo Defensa St
    (-34.6280, -58.3690, 15),  # Parque Lezama
    (-34.6360, -58.3640, 8),   # La Boca / Caminito & Estadio Boca Juniors
    (-34.6250, -58.3600, 6),   # Puerto Madero Dársena Sur
    (-34.6083, -58.3645, 6),   # Puente de la Mujer (Halfway / KM 21.1)
    (-34.5950, -58.3680, 8),   # Puerto Madero Dársena Norte
    (-34.5820, -58.3720, 9),   # Av. Ramón Castillo
    (-34.5680, -58.3900, 7),   # Aeroparque Jorge Newbery
    (-34.5550, -58.4080, 6),   # Costanera Norte along Río de la Plata
    (-34.5420, -58.4410, 8),   # Ciudad Universitaria (Mile 24)
    (-34.5452, -58.4482, 12),  # Av. Figueroa Alcorta Finish
]

BUENOS_AIRES_LANDMARKS = [
    (-34.5450, -58.4480, 12, "Start: Belgrano / Monumental", "flag_start"),
    (-34.5700, -58.4110, 8, "Planetario Palermo (Mile 3)", "star"),
    (-34.5828, -58.3912, 11, "Floralis Genérica", "park"),
    (-34.6037, -58.3816, 18, "Obelisco de Buenos Aires", "landmark"),
    (-34.6080, -58.3705, 14, "Plaza de Mayo & Casa Rosada", "castle"),
    (-34.6360, -58.3640, 8, "La Boca / Caminito", "cheer"),
    (-34.6083, -58.3645, 6, "Puente de la Mujer (Halfway)", "bridge"),
    (-34.5550, -58.4080, 6, "Costanera Norte (Mile 22)", "water"),
    (-34.5452, -58.4482, 12, "Finish: Av. Figueroa Alcorta", "flag_finish"),
]

london_track = generate_smooth_track(LONDON_COURSE, 700)
write_gpx("sample_data/london_marathon.gpx", "London Marathon", LONDON_LANDMARKS, london_track)

boston_track = generate_smooth_track(BOSTON_COURSE, 700)
write_gpx("sample_data/boston_marathon.gpx", "Boston Marathon", BOSTON_LANDMARKS, boston_track)

nyc_track = generate_smooth_track(NYC_COURSE, 700)
write_gpx("sample_data/nyc_marathon.gpx", "New York City Marathon", NYC_LANDMARKS, nyc_track)

ba_track = generate_smooth_track(BUENOS_AIRES_COURSE, 700)
write_gpx("sample_data/buenos_aires_marathon.gpx", "Buenos Aires Marathon", BUENOS_AIRES_LANDMARKS, ba_track)

print("Generated authentic, high-resolution tracks with realistic course curves.")
