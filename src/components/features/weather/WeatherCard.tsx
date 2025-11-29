import { WeatherData } from "@/lib/types/weather.types";
import { Box, Typography } from "@mui/material";

import WbSunnyOutlined from "@mui/icons-material/WbSunnyOutlined";
import { getWeatherIcon, getSmallWeatherIcon } from "@/lib/utils/weatherIcons";
import { getWeatherGif } from "@/lib/utils/weatherGifs";



interface WeatherCardProps {
  weather: WeatherData | null;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <Box className="w-full md:w-3/5 flex ">
      <Box className="w-full rounded-3xl bg-gradient-to-br from-purple-600/50 to-blue-600/50 backdrop-blur-2xl border border-white/20 shadow-2xl p-6 md:p-8 text-white relative overflow-hidden ">
        {/* Декоративные элементы */}
        <Box className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <Box className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <Box className="relative space-y-6 ">
          {weather ? (
            <>
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}>
                  {new Date().toLocaleDateString("ru-RU", {
                    weekday: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>

              <Box className="flex items-center justify-between">
                <Box>
                  <Box className="flex items-center  gap-3 ">
                    <Typography
                      sx={{ fontSize: "3rem", lineHeight: 1 }}
                      className=" animate-float">
                      {getWeatherIcon(weather.icon)}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "2rem", fontWeight: 600, lineHeight: 1 }}>
                      {weather.temperature}°C
                    </Typography>
                  </Box>
                </Box>

                <Box className=" ">
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 600,
                      lineHeight: 1,
                    }}>
                    {weather.city}, {weather.country}
                  </Typography>
                </Box>
              </Box>

              <Box className="flex items-center justify-around rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-4">
                <Box className="text-center">
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}>
                    Мин
                  </Typography>
                  <Typography sx={{ fontSize: "1.125rem", fontWeight: 600 }}>
                    {weather.minTemp}°
                  </Typography>
                </Box>
                <Box className="h-8 w-px bg-white/30" />
                <Box className="text-center">
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}>
                    Макс
                  </Typography>
                  <Typography sx={{ fontSize: "1.125rem", fontWeight: 600 }}>
                    {weather.maxTemp}°
                  </Typography>
                </Box>
              </Box>

              <Box
                className="rounded-2xl bg-blue-500/30 backdrop-blur-sm px-4 py-3 relative overflow-hidden"
                sx={{
                  backgroundImage: `url(${getWeatherGif(weather.icon)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}>
                <Box className="absolute inset-0 bg-blue-500/30 rounded-2xl" />
                <Box className="flex items-center justify-center text-center gap-2 relative z-10">
                  <Box className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                    {getSmallWeatherIcon(weather.icon)}
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        textTransform: "capitalize",
                        fontWeight: 500,
                      }}>
                      {weather.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}>
                    Влажность
                  </Typography>
                  <Typography sx={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {weather.humidity}%
                  </Typography>
                </Box>

                <Box className="text-right">
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}>
                    Ветер
                  </Typography>
                  <Typography sx={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {weather.windSpeed} м/с
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <Box className="text-center py-12">
              <Box className="flex justify-center mb-6  animate-float">
                <WbSunnyOutlined
                  sx={{ fontSize: 80, color: "#FDB813", opacity: 0.7 }}
                />
              </Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1.875rem",
                  mb: 2,
                  color: "white",
                }}>
                Нет данных о погоде
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
