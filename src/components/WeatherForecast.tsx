import { useState, useEffect } from 'react'
import type { Trip, WeatherData, ClothingRecommendation, WeatherAlert } from '../types'
import { getDatesBetween } from '../utils/helpers'

interface WeatherForecastProps {
  trip: Trip
}

// Weather code mapping (WMO codes)
const getWeatherInfo = (code: number): { description: string; icon: string } => {
  const weatherMap: Record<number, { description: string; icon: string }> = {
    0: { description: 'ท้องฟ้าแจ่มใส', icon: '☀️' },
    1: { description: 'ส่วนใหญ่แจ่มใส', icon: '🌤️' },
    2: { description: 'มีเมฆบางส่วน', icon: '⛅' },
    3: { description: 'มีเมฆมาก', icon: '☁️' },
    45: { description: 'มีหมอก', icon: '🌫️' },
    48: { description: 'หมอกแข็ง', icon: '🌫️' },
    51: { description: 'ฝนปรอยเบา', icon: '🌦️' },
    53: { description: 'ฝนปรอยปานกลาง', icon: '🌦️' },
    55: { description: 'ฝนปรอยหนัก', icon: '🌧️' },
    56: { description: 'ฝนเยือกแข็งเบา', icon: '🌨️' },
    57: { description: 'ฝนเยือกแข็งหนัก', icon: '🌨️' },
    61: { description: 'ฝนตกเบา', icon: '🌧️' },
    63: { description: 'ฝนตกปานกลาง', icon: '🌧️' },
    65: { description: 'ฝนตกหนัก', icon: '🌧️' },
    66: { description: 'ฝนเยือกแข็งเบา', icon: '🌨️' },
    67: { description: 'ฝนเยือกแข็งหนัก', icon: '🌨️' },
    71: { description: 'หิมะตกเบา', icon: '🌨️' },
    73: { description: 'หิมะตกปานกลาง', icon: '🌨️' },
    75: { description: 'หิมะตกหนัก', icon: '❄️' },
    77: { description: 'เกล็ดหิมะ', icon: '❄️' },
    80: { description: 'ฝนซู่เบา', icon: '🌦️' },
    81: { description: 'ฝนซู่ปานกลาง', icon: '🌧️' },
    82: { description: 'ฝนซู่หนัก', icon: '⛈️' },
    85: { description: 'หิมะซู่เบา', icon: '🌨️' },
    86: { description: 'หิมะซู่หนัก', icon: '❄️' },
    95: { description: 'พายุฝนฟ้าคะนอง', icon: '⛈️' },
    96: { description: 'พายุฝนฟ้าคะนองกับลูกเห็บเบา', icon: '⛈️' },
    99: { description: 'พายุฝนฟ้าคะนองกับลูกเห็บหนัก', icon: '⛈️' },
  }
  return weatherMap[code] || { description: 'ไม่ทราบสภาพอากาศ', icon: '❓' }
}

// Get clothing recommendations based on weather
const getClothingRecommendations = (weatherData: WeatherData[]): ClothingRecommendation[] => {
  const recommendations: ClothingRecommendation[] = []

  const avgTemp = weatherData.reduce((sum, d) => sum + (d.tempMax + d.tempMin) / 2, 0) / weatherData.length
  const hasRain = weatherData.some(d => d.precipitation > 5)
  const hasHeavyRain = weatherData.some(d => d.precipitation > 20)
  const hasCold = weatherData.some(d => d.tempMin < 15)
  const hasVeryCold = weatherData.some(d => d.tempMin < 10)
  const hasHot = weatherData.some(d => d.tempMax > 32)
  const hasSnow = weatherData.some(d => [71, 73, 75, 77, 85, 86].includes(d.weatherCode))

  // Temperature based
  if (hasVeryCold || hasSnow) {
    recommendations.push({ icon: '🧥', item: 'เสื้อโค้ทหนา/เสื้อขนเป็ด', reason: 'อุณหภูมิต่ำกว่า 10°C' })
    recommendations.push({ icon: '🧣', item: 'ผ้าพันคอ', reason: 'กันลมหนาว' })
    recommendations.push({ icon: '🧤', item: 'ถุงมือ', reason: 'ป้องกันความหนาว' })
    recommendations.push({ icon: '🎿', item: 'รองเท้าบูทกันหนาว', reason: 'เดินบนหิมะ/พื้นเย็น' })
  } else if (hasCold) {
    recommendations.push({ icon: '🧥', item: 'เสื้อกันหนาว/แจ็คเก็ต', reason: 'อุณหภูมิต่ำกว่า 15°C' })
    recommendations.push({ icon: '👖', item: 'กางเกงขายาว', reason: 'ให้ความอบอุ่น' })
  } else if (hasHot) {
    recommendations.push({ icon: '👕', item: 'เสื้อยืดบางเบา', reason: 'อากาศร้อนเกิน 32°C' })
    recommendations.push({ icon: '🩳', item: 'กางเกงขาสั้น', reason: 'ระบายอากาศดี' })
    recommendations.push({ icon: '🧢', item: 'หมวก', reason: 'กันแดด' })
    recommendations.push({ icon: '🕶️', item: 'แว่นกันแดด', reason: 'ป้องกันแสงแดด' })
  } else {
    recommendations.push({ icon: '👔', item: 'เสื้อแขนยาว/เสื้อคลุมบาง', reason: `อุณหภูมิเฉลี่ย ${avgTemp.toFixed(0)}°C` })
  }

  // Rain based
  if (hasHeavyRain) {
    recommendations.push({ icon: '☂️', item: 'ร่มใหญ่', reason: 'มีฝนตกหนัก' })
    recommendations.push({ icon: '🥾', item: 'รองเท้ากันน้ำ', reason: 'พื้นอาจเปียกลื่น' })
    recommendations.push({ icon: '🧥', item: 'เสื้อกันฝน', reason: 'ป้องกันเปียกฝน' })
  } else if (hasRain) {
    recommendations.push({ icon: '☂️', item: 'ร่มพกพา', reason: 'อาจมีฝนตก' })
  }

  // Always recommend
  recommendations.push({ icon: '🧴', item: 'ครีมกันแดด', reason: 'ป้องกัน UV' })

  return recommendations
}

// Get weather alerts
const getWeatherAlerts = (weatherData: WeatherData[]): WeatherAlert[] => {
  const alerts: WeatherAlert[] = []

  weatherData.forEach(day => {
    const date = new Date(day.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })

    // Storm alert
    if ([95, 96, 99].includes(day.weatherCode)) {
      alerts.push({
        type: 'storm',
        message: `⚠️ ${date}: พายุฝนฟ้าคะนอง ควรหลีกเลี่ยงกิจกรรมกลางแจ้ง`,
        icon: '⛈️'
      })
    }

    // Heavy rain alert
    if (day.precipitation > 20) {
      alerts.push({
        type: 'rain',
        message: `🌧️ ${date}: ฝนตกหนัก (${day.precipitation.toFixed(0)} มม.) เตรียมร่มและเสื้อกันฝน`,
        icon: '🌧️'
      })
    }

    // Cold alert
    if (day.tempMin < 10) {
      alerts.push({
        type: 'cold',
        message: `🥶 ${date}: อากาศหนาวจัด (${day.tempMin.toFixed(0)}°C) เตรียมเสื้อผ้าหนาๆ`,
        icon: '❄️'
      })
    }

    // Hot alert
    if (day.tempMax > 35) {
      alerts.push({
        type: 'hot',
        message: `🥵 ${date}: อากาศร้อนจัด (${day.tempMax.toFixed(0)}°C) ดื่มน้ำเยอะๆ หลีกเลี่ยงแดด`,
        icon: '🔥'
      })
    }

    // Snow alert
    if ([71, 73, 75, 77, 85, 86].includes(day.weatherCode)) {
      alerts.push({
        type: 'snow',
        message: `❄️ ${date}: มีหิมะตก เตรียมรองเท้ากันลื่น`,
        icon: '🌨️'
      })
    }
  })

  return alerts
}

export default function WeatherForecast({ trip }: WeatherForecastProps) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tripDates = getDatesBetween(trip.startDate, trip.endDate)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      setError(null)

      try {
        // Step 1: Geocode the destination
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trip.destination)}&count=1&language=en`
        )
        const geoData = await geoResponse.json()

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error(`ไม่พบตำแหน่ง "${trip.destination}"`)
        }

        const { latitude, longitude } = geoData.results[0]

        // Step 2: Fetch weather forecast
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=16`
        )
        const weatherJson = await weatherResponse.json()

        if (!weatherJson.daily) {
          throw new Error('ไม่สามารถดึงข้อมูลพยากรณ์อากาศได้')
        }

        // Step 3: Map weather data to trip dates
        const allWeatherData: WeatherData[] = weatherJson.daily.time.map((date: string, index: number) => {
          const weatherInfo = getWeatherInfo(weatherJson.daily.weather_code[index])
          return {
            date,
            tempMax: weatherJson.daily.temperature_2m_max[index],
            tempMin: weatherJson.daily.temperature_2m_min[index],
            precipitation: weatherJson.daily.precipitation_sum[index],
            weatherCode: weatherJson.daily.weather_code[index],
            weatherDescription: weatherInfo.description,
            weatherIcon: weatherInfo.icon,
          }
        })

        // Filter to trip dates only
        const tripWeather = tripDates
          .map(date => allWeatherData.find(w => w.date === date))
          .filter((w): w is WeatherData => w !== undefined)

        setWeatherData(tripWeather)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลอากาศ')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [trip.destination, trip.startDate, trip.endDate])

  const clothingRecs = weatherData.length > 0 ? getClothingRecommendations(weatherData) : []
  const alerts = weatherData.length > 0 ? getWeatherAlerts(weatherData) : []

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin text-4xl mb-4">🌀</div>
        <p className="text-gray-600">กำลังโหลดพยากรณ์อากาศ...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-gray-600 mt-2 text-sm">
            ลองตรวจสอบชื่อเมืองปลายทาง หรือรอสักครู่แล้วลองใหม่
          </p>
        </div>
      </div>
    )
  }

  if (weatherData.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-4">📅</div>
        <p className="text-gray-600">ยังไม่มีข้อมูลพยากรณ์อากาศสำหรับวันที่เดินทาง</p>
        <p className="text-gray-500 text-sm mt-2">
          Open-Meteo API รองรับพยากรณ์ล่วงหน้า 16 วัน
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="card bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
          <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
            🚨 เตือนสภาพอากาศ
          </h3>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="bg-white/70 rounded-lg px-4 py-3 text-sm text-gray-700 flex items-start gap-2"
              >
                <span className="text-lg">{alert.icon}</span>
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clothing Recommendations */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
          👕 แนะนำเสื้อผ้าและอุปกรณ์
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {clothingRecs.map((rec, index) => (
            <div
              key={index}
              className="bg-white/70 rounded-lg p-4 flex items-center gap-3 hover:bg-white transition-colors"
            >
              <span className="text-2xl">{rec.icon}</span>
              <div>
                <div className="font-medium text-gray-900">{rec.item}</div>
                <div className="text-xs text-gray-500">{rec.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          🌤️ พยากรณ์อากาศรายวัน - {trip.destination}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weatherData.map((day, index) => (
            <div
              key={day.date}
              className={`rounded-xl p-4 text-center transition-all hover:scale-105 ${
                day.precipitation > 10
                  ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                  : day.tempMax > 30
                  ? 'bg-gradient-to-br from-orange-100 to-yellow-100'
                  : day.tempMin < 15
                  ? 'bg-gradient-to-br from-cyan-100 to-blue-100'
                  : 'bg-gradient-to-br from-green-50 to-emerald-100'
              }`}
            >
              <div className="text-sm text-gray-600 font-medium">
                Day {index + 1}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {new Date(day.date).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'short',
                })}
              </div>
              <div className="text-4xl mb-2">{day.weatherIcon}</div>
              <div className="text-sm text-gray-700 mb-2">
                {day.weatherDescription}
              </div>
              <div className="flex justify-center items-center gap-2 text-sm">
                <span className="text-red-500 font-bold">{day.tempMax.toFixed(0)}°</span>
                <span className="text-gray-400">/</span>
                <span className="text-blue-500 font-bold">{day.tempMin.toFixed(0)}°</span>
              </div>
              {day.precipitation > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  💧 {day.precipitation.toFixed(1)} มม.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
        <h3 className="text-lg font-bold text-purple-800 mb-4">📊 สรุปสภาพอากาศ</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {Math.max(...weatherData.map(d => d.tempMax)).toFixed(0)}°C
            </div>
            <div className="text-xs text-gray-600">อุณหภูมิสูงสุด</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {Math.min(...weatherData.map(d => d.tempMin)).toFixed(0)}°C
            </div>
            <div className="text-xs text-gray-600">อุณหภูมิต่ำสุด</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {(weatherData.reduce((sum, d) => sum + (d.tempMax + d.tempMin) / 2, 0) / weatherData.length).toFixed(0)}°C
            </div>
            <div className="text-xs text-gray-600">อุณหภูมิเฉลี่ย</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-500">
              {weatherData.filter(d => d.precipitation > 1).length}
            </div>
            <div className="text-xs text-gray-600">วันที่มีฝน</div>
          </div>
        </div>
      </div>
    </div>
  )
}
