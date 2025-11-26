/**
 * Маппинг кодов погоды OpenWeatherMap на GIF-файлы
 */

export const getWeatherGif = (iconCode: string): string => {
  // Первые 2 символа - код погоды
  const code = iconCode.slice(0, 2);

  const gifMap: Record<string, string> = {
    '01': '/weather-gifs/partly-cloudy.gif', // ясно - используем partly-cloudy как fallback
    '02': '/weather-gifs/partly-cloudy.gif', // малооблачно
    '03': '/weather-gifs/overcast.gif', // облачно
    '04': '/weather-gifs/overcast.gif', // пасмурно
    '09': '/weather-gifs/heavy-rain.gif', // ливень
    '10': '/weather-gifs/rain.gif', // дождь
    '11': '/weather-gifs/thunderstorm.gif', // гроза
    '13': '/weather-gifs/snow.gif', // снег
    '50': '/weather-gifs/fog.gif', // туман
  };

  return gifMap[code] || '/weather-gifs/partly-cloudy.gif'; // fallback
};

