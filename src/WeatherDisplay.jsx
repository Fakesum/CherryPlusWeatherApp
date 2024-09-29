export default function WeatherDisplay({ weatherData }){
    return (
        <div className="weather-card">
            <div className="weather-header">
                <div>
                    <h1>{weatherData.name}, {weatherData.sys.country}</h1>
                    <p>{weatherData.weather[0].description}</p>
                </div>
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} alt="Weather icon" className="weather-icon"/>
            </div>
            <div className="temperature">{Math.round((weatherData.main.temp - 273.15)*100)/100}°C</div>
            <p>Feels like {Math.round((weatherData.main.feels_like - 273.15) * 100) / 100}°C</p>
            <div className="details">
                <div className="detail-item"><strong>Humidity:</strong> {weatherData.main.humidity}%</div>
                <div className="detail-item"><strong>Wind:</strong> {weatherData.wind.speed} m/s, {weatherData.wind.deg}°</div>
                <div className="detail-item"><strong>Pressure:</strong> {weatherData.main.pressure} hPa</div>
                <div className="detail-item"><strong>Visibility:</strong> {weatherData.visibility / 1000} km</div>
            </div>
        </div>
    )
}