import { useEffect } from 'react'
import ReactLoading from 'react-loading'

export default function WeatherDisplay({ weatherData }){
    function replaceWithRating(rating_id){
        switch (rating_id) {
            case 1:
                return "Good";
            case 2:
                return "Fair";
            case 3:
                return "Moderate";
            case 4:
                return "Poor";
            case 5:
                return "Very Poor";      
            default:
                return rating_id;
        }
    }
    return (
        <div className="weather-card">
            <div className="weather-header">
                <div>
                    <h1>{weatherData.name}, {weatherData.sys.country}</h1>
                    <p>{weatherData.weather[0].description}</p>
                </div>
                {/* Using 4x images, other image sizes avalable: 1x 2x 4x */}
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} alt="Weather icon" className="weather-icon"/>
            </div>
            <div className="temperature">{Math.round((weatherData.main.temp - 273.15)*100)/100}°C</div>
            <p>Feels like {Math.round((weatherData.main.feels_like - 273.15) * 100) / 100}°C</p>
            <div className="details">
                <div className="detail-item"><strong>Humidity:</strong> {weatherData.main.humidity}%</div>
                <div className="detail-item"><strong>Wind:</strong> {weatherData.wind.speed} m/s, {weatherData.wind.deg}°</div>
                <div className="detail-item"><strong>Pressure:</strong> {weatherData.main.pressure} hPa</div>
                <div className="detail-item"><strong>Visibility:</strong> {weatherData.visibility / 1000} km</div>
                {/* AQI is loaded from another api */}
                {
                    useEffect(()=>{
                        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=da00953907b5ec2c5db00f53ffd89e68`)
                            .then((res) => {return res.json()})
                            .then(res => {document.querySelector('.replace-with-aqi').outerHTML = ` ${replaceWithRating(res.list[0].main.aqi)}(${res.list[0].main.aqi})`})
                            .catch((e) => {});
                        return () => {};
                    })
                }
                <div className="detail-item aqi-detail-item"><strong>AQI:</strong><div className='replace-with-aqi'><ReactLoading></ReactLoading></div></div>
            </div>
            {/* There is more information avalable we are not displaying, but this is good enough
            to get an idea about the weather. */}

        </div>
    )
}