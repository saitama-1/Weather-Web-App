import React from 'react';

function WeatherDisplay({ data }) {
  const { resolvedAddress, days } = data;

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getWeatherDescription = (conditions) => {
    return conditions || 'Đang cập nhật';
  };

  return (
    <div className="weather-display">
      <h2>Thời tiết tại: {resolvedAddress}</h2>
      
      <div className="forecast-grid">
        {days.map((day, index) => (
          <div key={day.datetime} className={`weather-card ${index === 1 ? 'today' : ''}`}>
            <h3>{index === 0 ? 'Hôm qua' : index === 1 ? 'Hôm nay' : 'Ngày mai'}</h3>
            <p className="date">{formatDate(day.datetime)}</p>
            <div className="weather-details">
              <p className="temperature">{day.temp}°C</p>
              <p>Điều kiện: {getWeatherDescription(day.conditions)}</p>
              <p>Tốc độ gió: {day.windspeed} km/h</p>
              <p>Khả năng mưa: {day.precipprob}%</p>
              <p>Cao nhất: {day.tempmax}°C / Thấp nhất: {day.tempmin}°C</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherDisplay;