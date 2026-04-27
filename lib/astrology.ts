/**
 * Vedic Astrology Engine — powered by @fusionstrings/panchangam
 * Uses Swiss Ephemeris (NASA/JPL precision) via WebAssembly
 *
 * Install: npx jsr add @fusionstrings/panchangam
 * npm equivalent: npm:@jsr/fusionstrings__panchangam
 */

import {
  calculate_daily_panchang,
  calculate_planets,
  calculate_vimshottari,
  p_julday,
  Location,
} from '@fusionstrings/panchangam'

// ─── Public types (same shape as before — no consumer changes needed) ─────────

export interface PlanetPosition {
  name: string
  nameNepali: string
  longitude: number
  sign: number
  signName: string
  signNameNepali: string
  degree: number
  nakshatra: string
  nakshatraNameNepali: string
  nakshatraPada: number
  isRetrograde: boolean
  house: number
  dignity?: string
}

export interface KundaliChart {
  ascendant: {
    sign: number
    signName: string
    signNameNepali: string
    degree: number
  }
  planets: PlanetPosition[]
  houses: number[]
}

export interface Panchangam {
  tithi: string
  vara: string
  nakshatra: string
  yoga: string
  karana: string
  sunriseTime: string
  sunsetTime: string
  tithiEndTime?: string
  nakshatraEndTime?: string
  yogaEndTime?: string
}

export interface DashaPeriod {
  planet: string
  planetNepali: string
  startDate: string
  endDate: string
  yearsRemaining: number
  antardasha: AntarDasha[]
  pratyantardasha?: string
  pratyantardashaEnd?: string
}

export interface AntarDasha {
  planet: string
  planetNepali: string
  startDate: string
  endDate: string
}

export interface FullKundaliData {
  lagna: string
  lagnaSign: number
  rashi: string
  rashiSign: number
  nakshatra: string
  nakshatraPada: number
  yoga: string
  karana: string
  D1: KundaliChart
  D9: KundaliChart
  D10: KundaliChart
  D12: KundaliChart
  panchangam: Panchangam
  dasha: DashaPeriod
  birthDetails: {
    julianDay: number
    siderealTime: number
    ayanamsa: number
  }
}

export interface BirthInput {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second?: number
  latitude: number
  longitude: number
  altitude?: number
  utcOffset?: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RASHIS_NP = [
  'मेष','वृष','मिथुन','कर्कट','सिंह','कन्या',
  'तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन',
]

const RASHIS_EN = [
  'Mesha','Vrishabha','Mithuna','Karkata','Simha','Kanya',
  'Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena',
]

const NAKSHATRAS_NP = [
  'अश्विनी','भरणी','कृत्तिका','रोहिणी','मृगशिर','आर्द्रा',
  'पुनर्वसु','पुष्य','आश्लेषा','मघा','पूर्वा फाल्गुनी','उत्तरा फाल्गुनी',
  'हस्त','चित्रा','स्वाती','विशाखा','अनुराधा','ज्येष्ठा',
  'मूल','पूर्वाषाढ','उत्तराषाढ','श्रवण','धनिष्ठा','शतभिषा',
  'पूर्वा भाद्रपद','उत्तरा भाद्रपद','रेवती',
]

const PLANETS_NP: Record<string,string> = {
  Sun:'सूर्य', Moon:'चन्द्र', Mars:'मङ्गल', Mercury:'बुध',
  Jupiter:'बृहस्पति', Venus:'शुक्र', Saturn:'शनि',
  Rahu:'राहु', Ketu:'केतु',
}

const DASHA_NP: Record<string,string> = {
  Ketu:'केतु', Venus:'शुक्र', Sun:'सूर्य', Moon:'चन्द्र',
  Mars:'मङ्गल', Rahu:'राहु', Jupiter:'बृहस्पति', Saturn:'शनि',
  Mercury:'बुध',
}

const VARAS_NP = ['रविवार','सोमवार','मङ्गलवार','बुधवार','बिहीवार','शुक्रवार','शनिवार']

const DASHA_YEARS: Record<string,number> = {
  Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7,
  Rahu:18, Jupiter:16, Saturn:19, Mercury:17,
}

const DASHA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']

const PLANET_ORDER = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lonToSignDeg(lon: number): { sign: number; degree: number } {
  const normalized = ((lon % 360) + 360) % 360
  const sign = Math.floor(normalized / 30)
  const degree = normalized % 30
  return { sign, degree }
}

function lonToNakshatra(lon: number): { nakshatra: number; pada: number } {
  const normalized = ((lon % 360) + 360) % 360
  const idx = Math.floor(normalized / (360 / 27))
  const pada = Math.floor((normalized % (360 / 27)) / (360 / 108)) + 1
  return { nakshatra: idx % 27, pada }
}

function fmtDate(ms: number): string {
  return new Date(ms).toLocaleDateString('ne-NP', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function fmtTime(ms: number | null | undefined): string {
  if (!ms) return 'N/A'
  return new Date(ms).toLocaleTimeString('ne-NP', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

function buildDivisionalLon(lon: number, divisor: number): number {
  const { sign, degree } = lonToSignDeg(lon)
  const divDeg = degree * divisor
  const divSign = (sign * divisor + Math.floor(divDeg / 30)) % 12
  return divSign * 30 + (divDeg % 30)
}

function buildNavamsaLon(lon: number): number {
  const { sign, degree } = lonToSignDeg(lon)
  const navDeg = degree * 9
  const navSign = (sign * 9 + Math.floor(navDeg / 30)) % 12
  return navSign * 30 + (navDeg % 30)
}

function buildChart(planets: PlanetPosition[], ascLon: number): KundaliChart {
  const { sign: ascSign, degree: ascDeg } = lonToSignDeg(ascLon)
  const houses: number[] = Array.from({ length: 12 }, (_, i) => (ascSign + i) % 12)
  const chartPlanets = planets.map(p => ({
    ...p,
    house: ((p.sign - ascSign + 12) % 12) + 1,
  }))
  return {
    ascendant: {
      sign: ascSign,
      signName: RASHIS_EN[ascSign],
      signNameNepali: RASHIS_NP[ascSign],
      degree: Math.round(ascDeg * 100) / 100,
    },
    planets: chartPlanets,
    houses,
  }
}

function remap(p: PlanetPosition, newLon: number): PlanetPosition {
  const { sign, degree } = lonToSignDeg(newLon)
  const { nakshatra, pada } = lonToNakshatra(newLon)
  return {
    ...p,
    longitude: newLon,
    sign,
    signName: RASHIS_EN[sign],
    signNameNepali: RASHIS_NP[sign],
    degree: Math.round(degree * 100) / 100,
    nakshatra: NAKSHATRAS_NP[nakshatra],
    nakshatraNameNepali: NAKSHATRAS_NP[nakshatra],
    nakshatraPada: pada,
    // house will be recomputed in buildChart
    house: 1,
  }
}

function buildAntardashaList(
  mahaName: string,
  mahaStartMs: number,
  mahaYears: number,
): AntarDasha[] {
  const msPerYear = 365.25 * 24 * 3600 * 1000
  const antardasha: AntarDasha[] = []
  const startIdx = DASHA_ORDER.indexOf(mahaName)
  let adStart = mahaStartMs
  for (let j = 0; j < 9; j++) {
    const adPlanet = DASHA_ORDER[(startIdx + j) % 9]
    const adYears = (mahaYears * DASHA_YEARS[adPlanet]) / 120
    const adEnd = adStart + adYears * msPerYear
    antardasha.push({
      planet: adPlanet,
      planetNepali: DASHA_NP[adPlanet] || adPlanet,
      startDate: fmtDate(adStart),
      endDate: fmtDate(adEnd),
    })
    adStart = adEnd
  }
  return antardasha
}

// Fallback ascendant when library omits it
function fallbackAscendant(jd: number, lat: number, lng: number): number {
  const T = (jd - 2451545.0) / 36525
  let LST = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T + lng
  LST = ((LST % 360) + 360) % 360
  const eps = (23.439291111 - 0.013004167 * T) * Math.PI / 180
  const latR = lat * Math.PI / 180
  const LSTR = LST * Math.PI / 180
  const asc = Math.atan2(Math.cos(LSTR), -(Math.sin(LSTR) * Math.cos(eps) + Math.tan(latR) * Math.sin(eps)))
  const ascDeg = ((asc * 180 / Math.PI) + 360) % 360
  const ayanamsa = 23.85 + 0.0136 * T + (jd - 2415020.0) * (50.2564 / 3600) / 365.25
  return ((ascDeg - ayanamsa) % 360 + 360) % 360
}

// ─── Main async function ──────────────────────────────────────────────────────

export async function calculateKundali(input: BirthInput): Promise<FullKundaliData> {
  const {
    year, month, day, hour, minute, second = 0,
    latitude, longitude: lng, altitude = 0, utcOffset = 5.75,
  } = input

  // 1. Julian Day in Universal Time
  const hourUT = hour + minute / 60 + second / 3600 - utcOffset
  const jd = p_julday(year, month, day, hourUT, 1) // flag 1 = Gregorian

  // 2. Location
  const loc = new Location(latitude, lng, altitude)

  // 3. Panchangam — precise tithi, nakshatra, yoga, karana, sunrise/sunset
  const pRaw = calculate_daily_panchang(year, month, day, loc, 1) // mode 1 = Lahiri
  const dayOfWeek = new Date(year, month - 1, day).getDay()

  const panchangam: Panchangam = {
    tithi:    pRaw.tithi_name    || 'प्रतिपदा',
    vara:     VARAS_NP[dayOfWeek],
    nakshatra: pRaw.nakshatra_name || 'अश्विनी',
    yoga:     pRaw.yoga_name     || 'विष्कुम्भ',
    karana:   pRaw.karana_name   || 'बव',
    sunriseTime:      fmtTime(pRaw.sunrise),
    sunsetTime:       fmtTime(pRaw.sunset),
    tithiEndTime:     pRaw.tithi_end_time     ? fmtTime(pRaw.tithi_end_time)     : undefined,
    nakshatraEndTime: pRaw.nakshatra_end_time ? fmtTime(pRaw.nakshatra_end_time) : undefined,
    yogaEndTime:      pRaw.yoga_end_time      ? fmtTime(pRaw.yoga_end_time)      : undefined,
  }

  // 4. Planet positions — Swiss Ephemeris sidereal (Lahiri)
  const rawPlanets: any[] = calculate_planets(jd, 1)

  // Map library output to our named planets
  const pMap: Record<string, any> = {}
  let ascLon = 0

  for (const p of rawPlanets) {
    const n: string = (p.name || '').toLowerCase().replace(/[_\s]/g, '')
    if (n.includes('asc') || n.includes('lagna'))              { ascLon = p.longitude; continue }
    if (n.includes('sun'))                                       pMap['Sun']     = p
    else if (n.includes('moon'))                                 pMap['Moon']    = p
    else if (n.includes('mars'))                                 pMap['Mars']    = p
    else if (n.includes('merc'))                                 pMap['Mercury'] = p
    else if (n.includes('jupi'))                                 pMap['Jupiter'] = p
    else if (n.includes('venu'))                                 pMap['Venus']   = p
    else if (n.includes('satu'))                                 pMap['Saturn']  = p
    else if (n.includes('rahu') || n.includes('northnode') || n.includes('meannode'))
                                                                 pMap['Rahu']    = p
    else if (n.includes('ketu') || n.includes('southnode') || n.includes('meanapog'))
                                                                 pMap['Ketu']    = p
  }

  // Also check panchangam for lagna longitude
  if (!ascLon && (pRaw as any).lagna_longitude) {
    ascLon = (pRaw as any).lagna_longitude
  }
  if (!ascLon) ascLon = fallbackAscendant(jd, latitude, lng)

  const { sign: ascSign } = lonToSignDeg(ascLon)

  const planets: PlanetPosition[] = PLANET_ORDER.map(name => {
    const raw = pMap[name]
    if (!raw) {
      return {
        name, nameNepali: PLANETS_NP[name] || name,
        longitude: 0, sign: 0, signName: RASHIS_EN[0], signNameNepali: RASHIS_NP[0],
        degree: 0, nakshatra: NAKSHATRAS_NP[0], nakshatraNameNepali: NAKSHATRAS_NP[0],
        nakshatraPada: 1, isRetrograde: false, house: 1, dignity: '',
      }
    }
    const lon: number = raw.longitude
    const { sign, degree } = lonToSignDeg(lon)
    const { nakshatra, pada } = lonToNakshatra(lon)
    return {
      name,
      nameNepali: PLANETS_NP[name] || name,
      longitude: lon,
      sign,
      signName: RASHIS_EN[sign],
      signNameNepali: RASHIS_NP[sign],
      degree: Math.round(degree * 100) / 100,
      nakshatra: NAKSHATRAS_NP[nakshatra],
      nakshatraNameNepali: NAKSHATRAS_NP[nakshatra],
      nakshatraPada: pada,
      isRetrograde: raw.is_retrograde ?? (raw.speed < 0),
      house: ((sign - ascSign + 12) % 12) + 1,
      dignity: raw.dignity ?? '',
    }
  })

  // 5. Divisional charts
  const D1 = buildChart(planets, ascLon)

  const d9Asc = buildNavamsaLon(ascLon)
  const D9  = buildChart(planets.map(p => remap(p, buildNavamsaLon(p.longitude))), d9Asc)

  const d10Asc = buildDivisionalLon(ascLon, 10)
  const D10 = buildChart(planets.map(p => remap(p, buildDivisionalLon(p.longitude, 10))), d10Asc)

  const d12Asc = buildDivisionalLon(ascLon, 12)
  const D12 = buildChart(planets.map(p => remap(p, buildDivisionalLon(p.longitude, 12))), d12Asc)

  // 6. Vimshottari Dasha
  const moon = planets.find(p => p.name === 'Moon')!
  const birthMs = Date.UTC(year, month - 1, day, Math.floor(hour), minute, second)
  const nowMs   = Date.now()

  const dashaRaw: any = calculate_vimshottari(moon.longitude, birthMs, nowMs)

  const mahaName: string = dashaRaw.mahadasha || 'Ketu'
  const mahaEndMs: number = Number(dashaRaw.mahadasha_end_date)
  const mahaYears = DASHA_YEARS[mahaName] ?? 7
  const mahaStartMs: number = Number(
    dashaRaw.mahadasha_start_date ?? (mahaEndMs - mahaYears * 365.25 * 24 * 3600 * 1000)
  )
  const yearsLeft = Math.max(0, (mahaEndMs - nowMs) / (365.25 * 24 * 3600 * 1000))

  const dasha: DashaPeriod = {
    planet: mahaName,
    planetNepali: DASHA_NP[mahaName] || mahaName,
    startDate: fmtDate(mahaStartMs),
    endDate:   fmtDate(mahaEndMs),
    yearsRemaining: Math.round(yearsLeft * 100) / 100,
    antardasha: buildAntardashaList(mahaName, mahaStartMs, mahaYears),
    pratyantardasha: dashaRaw.pratyantardasha,
    pratyantardashaEnd: dashaRaw.pratyantardasha_end_date
      ? fmtDate(Number(dashaRaw.pratyantardasha_end_date)) : undefined,
  }

  // 7. Assemble
  const { nakshatra: moonNak, pada: moonPada } = lonToNakshatra(moon.longitude)

  return {
    lagna:         RASHIS_NP[ascSign],
    lagnaSign:     ascSign,
    rashi:         RASHIS_NP[moon.sign],
    rashiSign:     moon.sign,
    nakshatra:     NAKSHATRAS_NP[moonNak],
    nakshatraPada: moonPada,
    yoga:          panchangam.yoga,
    karana:        panchangam.karana,
    D1, D9, D10, D12,
    panchangam,
    dasha,
    birthDetails: {
      julianDay:    Math.round(jd * 1000) / 1000,
      siderealTime: Math.round(ascLon * 100) / 100,
      ayanamsa:     0, // managed internally by Swiss Ephemeris
    },
  }
}
