'use client'
import React from "react";
import {
  Container,
  Box,
  Typography,
  Snackbar,
  Alert,
  
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WbSunnyOutlined from "@mui/icons-material/WbSunnyOutlined";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { WeatherData } from "@/lib/types/weather.types";
import { fetchWeatherForCity } from "@/lib/api/weatherService";
import { getWeatherIcon, getSmallWeatherIcon } from "@/lib/utils/weatherIcons";
import { getWeatherGif } from "@/lib/utils/weatherGifs";


export default function Home() {
  
  const [inputData, setInputData] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);
  };

  const handleButtonClick = async () => {
    const trimmedQuery = inputData.trim();

    if (!trimmedQuery) {
      return;
    }

    try {
      setIsLoading(true);
      const weather = await fetchWeatherForCity(trimmedQuery);
      setCurrentWeather(weather);
    } catch (error) {
      console.error("Ошибка при загрузке погоды:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 p-4">
      <Container
        maxWidth="lg"
        className="flex flex-col md:flex-row md:items-stretch gap-6">
        <Box className="w-full md:w-2/5 flex">
          <Box className="w-full rounded-3xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 backdrop-blur-2xl border border-white/20 shadow-2xl p-6 space-y-6">
            {/* Поиск */}
            <Box>
              <Typography className="text-white/70 text-xs  uppercase tracking-wider ">
                Поиск города
              </Typography>
              <Box className="flex gap-3 mt-3">
                <input
                  type="text"
                  value={inputData}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading && inputData.trim()) {
                      handleButtonClick();
                    }
                  }}
                  placeholder="Введите название города"
                  className="flex-1 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 transition"
                />
                <Button onClick={handleButtonClick} disabled={isLoading}>
                  {isLoading ? (
                    "..."
                  ) : (
                    <SearchIcon sx={{ fontSize: 20, color: "white" }} />
                  )}
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography className="text-white font-semibold  text-base">
                История поиска
              </Typography>
              <Box className="space-y-2 mt-3">
                <Box className="rounded-2xl bg-white/5 hover:bg-white/10 px-4 py-3 text-sm text-white/80 cursor-pointer transition">
                  <Typography variant="body2">История будет здесь</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Правая карточка: Погода */}
        <Box className="w-full md:w-3/5 flex">
          <Box className="w-full rounded-3xl bg-gradient-to-br from-purple-600/50 to-blue-600/50 backdrop-blur-2xl border border-white/20 shadow-2xl p-6 md:p-8 text-white relative overflow-hidden">
            {/* Декоративные элементы */}
            <Box className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <Box className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <Box className="relative space-y-6">
              {currentWeather ? (
                <>
                  <Box>
                    <Typography className="text-sm text-white/70">
                      {new Date().toLocaleDateString("ru-RU", {
                        weekday: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>

                  <Box className="flex items-start justify-between">
                    <Box>
                      <Box className="flex items-center gap-3 mb-2">
                        <Typography className="text-6xl">
                          {getWeatherIcon(currentWeather.icon)}
                        </Typography>
                        <Typography className="text-5xl font-semibold">
                          {currentWeather.temperature}°C
                        </Typography>
                      </Box>
                      <Typography className="text-2xl font-semibold">
                        {currentWeather.city}, {currentWeather.country}
                      </Typography>
                    </Box>

                    <Box className="text-6xl opacity-70 animate-float">
                      {getWeatherIcon(currentWeather.icon)}
                    </Box>
                  </Box>

                  <Box className="flex items-center justify-around rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-4">
                    <Box className="text-center">
                      <Typography className="text-xs text-white/70">
                        Мин
                      </Typography>
                      <Typography className="text-lg font-semibold">
                        {currentWeather.minTemp}°
                      </Typography>
                    </Box>
                    <Box className="h-8 w-px bg-white/30" />
                    <Box className="text-center">
                      <Typography className="text-xs text-white/70">
                        Макс
                      </Typography>
                      <Typography className="text-lg font-semibold">
                        {currentWeather.maxTemp}°
                      </Typography>
                    </Box>
                  </Box>

                  <Box 
                    className="rounded-2xl bg-blue-500/30 backdrop-blur-sm px-4 py-3 relative overflow-hidden"
                    sx={{
                      backgroundImage: `url(${getWeatherGif(currentWeather.icon)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                  
                    <Box className="absolute inset-0 bg-blue-500/30 rounded-2xl" />
                    <Box className="flex items-center justify-center text-center gap-2 relative z-10">
                      <Box className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                        {getSmallWeatherIcon(currentWeather.icon)}
                        <Typography className="text-sm capitalize font-medium">
                          {currentWeather.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box className="grid grid-cols-2 gap-4">
                    <Box>
                      <Typography className="text-sm text-white/70">
                        Влажность
                      </Typography>
                      <Typography className="text-2xl font-semibold">
                        {currentWeather.humidity}%
                      </Typography>
                    </Box>

                    <Box className="text-right">
                      <Typography className="text-sm text-white/70">
                        Ветер
                      </Typography>
                      <Typography className="text-2xl font-semibold">
                        {currentWeather.windSpeed} м/с
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box className="text-center py-12">
                  <Box className="flex justify-center mb-6">
                    <WbSunnyOutlined
                      sx={{ fontSize: 80, color: "#FDB813", opacity: 0.7 }}
                    />
                  </Box>
                  <Typography className="font-semibold text-3xl mb-2 text-white">
                    Нет данных о погоде
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>

      <Snackbar>
        <Alert></Alert>
      </Snackbar>
    </Box>
  );
}
