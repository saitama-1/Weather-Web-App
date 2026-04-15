import WeatherDisplay from "./components/WeatherDisplay";
// import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // 1. Khai báo các State
  const [location, setLocation] = useState(""); // Vị trí người dùng nhập
  const [weatherData, setWeatherData] = useState(null); // Dữ liệu thời tiết
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi (nếu có)

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const BASE_URL =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

  // 2. Hàm gọi API để lấy dữ liệu thời tiết
  // Thay thế hàm fetchWeather cũ bằng phiên bản này
  const fetchWeather = async (queryLocation) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    // Tính toán ngày tháng cho 3 ngày (hôm qua, hôm nay, ngày mai)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Format lại ngày tháng theo chuẩn YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split("T")[0];
    const startDate = formatDate(yesterday);
    const endDate = formatDate(tomorrow);

    try {
      // Gọi API với khoảng thời gian đã tính
      const response = await fetch(
        `${BASE_URL}${encodeURIComponent(queryLocation)}/${startDate}/${endDate}?unitGroup=metric&key=${API_KEY}&contentType=json`,
      );

      if (!response.ok) {
        throw new Error("Không tìm thấy địa điểm hoặc có lỗi xảy ra.");
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Xử lý khi người dùng submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location);
    }
  };

  // 4. Xử lý khi người dùng muốn lấy vị trí hiện tại
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (err) => {
          setError("Không thể lấy vị trí hiện tại: " + err.message);
        },
      );
    } else {
      setError("Trình duyệt của bạn không hỗ trợ định vị.");
    }
  };

  // 5. Tự động lấy vị trí hiện tại khi component được mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (err) => {
          console.error("Lỗi lấy vị trí:", err);
          // Fallback: lấy thời tiết mặc định cho Hà Nội nếu không lấy được vị trí
          fetchWeather("Hanoi");
        },
      );
    } else {
      fetchWeather("Hanoi");
    }
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần khi mount

  return (
    <div className="app">
      <h1>Ứng Dụng Thời Tiết</h1>

      {/* Form nhập liệu */}
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Nhập tên thành phố hoặc tọa độ (vd: Hanoi)"
          required
        />
        <button type="submit">Xem thời tiết</button>
      </form>

      <button onClick={handleGetCurrentLocation} className="location-btn">
        Dùng vị trí hiện tại của tôi
      </button>

      {/* Khu vực hiển thị trạng thái */}
      {loading && <div className="loading">Đang tải dữ liệu...</div>}
      {error && <div className="error">Lỗi: {error}</div>}

      {/* Khu vực hiển thị dữ liệu thời tiết */}
      {weatherData && <WeatherDisplay data={weatherData} />}
    </div>
  );
}

export default App;
