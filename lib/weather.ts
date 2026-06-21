// WMO weather code → label + lucide icon (Open-Meteo uses WMO codes).
const WMO: Record<number, [string, string]> = {
  0: ['Clear', 'i-lucide-sun'],
  1: ['Mainly clear', 'i-lucide-sun'],
  2: ['Partly cloudy', 'i-lucide-cloud-sun'],
  3: ['Overcast', 'i-lucide-cloud'],
  45: ['Fog', 'i-lucide-cloud-fog'],
  48: ['Fog', 'i-lucide-cloud-fog'],
  51: ['Light drizzle', 'i-lucide-cloud-drizzle'],
  53: ['Drizzle', 'i-lucide-cloud-drizzle'],
  55: ['Drizzle', 'i-lucide-cloud-drizzle'],
  61: ['Light rain', 'i-lucide-cloud-rain'],
  63: ['Rain', 'i-lucide-cloud-rain'],
  65: ['Heavy rain', 'i-lucide-cloud-rain-wind'],
  66: ['Freezing rain', 'i-lucide-cloud-rain'],
  67: ['Freezing rain', 'i-lucide-cloud-rain'],
  71: ['Light snow', 'i-lucide-cloud-snow'],
  73: ['Snow', 'i-lucide-cloud-snow'],
  75: ['Heavy snow', 'i-lucide-cloud-snow'],
  77: ['Snow grains', 'i-lucide-cloud-snow'],
  80: ['Rain showers', 'i-lucide-cloud-rain'],
  81: ['Rain showers', 'i-lucide-cloud-rain'],
  82: ['Heavy showers', 'i-lucide-cloud-rain-wind'],
  95: ['Thunderstorm', 'i-lucide-cloud-lightning'],
  96: ['Thunderstorm', 'i-lucide-cloud-lightning'],
  99: ['Thunderstorm', 'i-lucide-cloud-lightning'],
}

export function wmo(code: number): { label: string, icon: string } {
  const [label, icon] = WMO[code] ?? ['—', 'i-lucide-cloud']
  return { label, icon }
}

export function windDir(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]!
}

// Playa-specific dust heuristic from wind gusts (mph). Whiteouts are the real
// hazard on the playa, so this is the most useful read of the forecast.
export function dustRisk(gustMph: number): { label: string, color: string } {
  if (gustMph >= 35)
    return { label: 'High dust risk', color: '#dc2626' }
  if (gustMph >= 25)
    return { label: 'Dusty — goggles up', color: '#d97706' }
  if (gustMph >= 15)
    return { label: 'Breezy', color: '#65a30d' }
  return { label: 'Calm', color: '#16a34a' }
}
