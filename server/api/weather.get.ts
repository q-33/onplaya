interface WeatherDay { date: string, code: number, max: number, min: number, windMax: number, gustMax: number, precip: number, sunrise: string, sunset: string }
interface WeatherResult { current: Record<string, number> | null, days: WeatherDay[], updatedAt: string }

// Live weather + 7-day forecast for Black Rock City, proxied + cached from
// Open-Meteo (free, no API key). Cached 10 min to be a good API citizen.
export default defineCachedEventHandler(async (): Promise<WeatherResult> => {
  const params = new URLSearchParams({
    latitude: '40.7833',
    longitude: '-119.2079',
    timezone: 'America/Los_Angeles',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_gusts_10m_max,precipitation_probability_max,sunrise,sunset',
    forecast_days: '7',
  })

  const data = await $fetch<any>(`https://api.open-meteo.com/v1/forecast?${params}`)
  const d = data.daily
  const days: WeatherDay[] = (d?.time ?? []).map((date: string, i: number) => ({
    date,
    code: d.weather_code[i],
    max: d.temperature_2m_max[i],
    min: d.temperature_2m_min[i],
    windMax: d.wind_speed_10m_max[i],
    gustMax: d.wind_gusts_10m_max[i],
    precip: d.precipitation_probability_max[i],
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
  }))

  return {
    current: data.current ?? null,
    days,
    updatedAt: new Date().toISOString(),
  }
}, { maxAge: 600, name: 'weather', getKey: () => 'brc', swr: true })
