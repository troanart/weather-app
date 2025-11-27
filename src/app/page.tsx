"use client";

import React, { useState, useEffect } from "react";

import { Container, Box, Snackbar, Alert } from "@mui/material";

import { WeatherData } from "@/lib/types/weather.types";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "@/lib/constants/messages.constants";


import { fetchWeatherForCity } from "@/lib/api/weatherService";

import { useHistoryStore } from "@/lib/stores/historyStore";

import { getWeatherByCoordinates } from "@/lib/api/weatherApi";
import { transformWeatherData } from "@/lib/api/weatherService";
import { CityGeoData } from "@/lib/types/weather.types";


import WeatherCard from "@/components/features/weather/WeatherCard";
import SearchBar from "@/components/features/search-history/SearchBar";
import HisoryList from "@/components/features/history-list/HistoryList";
import WeatherCardSkeleton from "@/components/features/weather/WeatherCardSkeleton";


export default function Home() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error");
  const [inputData, setInputData] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const addToHistory = useHistoryStore((state) => state.addToHistory);
  const initializeHistory = useHistoryStore((state) => state.initializeHistory);

  // Инициализация истории из localStorage после монтирования (только на клиенте)
  useEffect(() => {
    initializeHistory();
  }, [initializeHistory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleButtonClick = async () => {
    const trimmedQuery = inputData.trim();

    if (!trimmedQuery) {
      showSnackbar(ERROR_MESSAGES.EMPTY_INPUT, "error");
      return;
    }

    try {
      setIsLoading(true);
      const startTime = Date.now();
      const { weather, cityData } = await fetchWeatherForCity(trimmedQuery);
      const elapsed = Date.now() - startTime;
      const minDelay = 500;
      if (elapsed < minDelay) {
        // запрос слшком быстрый ( ставим задержку )
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
      }
      setCurrentWeather(weather);
      addToHistory({
        city: cityData.name,
        country: cityData.country,
        lat: cityData.lat,
        lon: cityData.lon,
      });
      setInputData("");
      showSnackbar(SUCCESS_MESSAGES.WEATHER_LOADED, "success");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : ERROR_MESSAGES.UNKNOWN_ERROR;
      showSnackbar(errorMessage, "error");
      console.error("Ошибка при загрузке погоды:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = async (lat: number, lon: number) => {
    try {
      setIsLoading(true);

      // Получаем погоду по координатам
      const weatherData = await getWeatherByCoordinates(lat, lon);

      // Нужно получить cityData , можно использовать существующий элемент из истории
      const historyItem = useHistoryStore
        .getState()
        .history.find((item) => item.lat === lat && item.lon === lon);

      if (historyItem) {
        const cityData: CityGeoData = {
          name: historyItem.city,
          country: historyItem.country,
          lat: historyItem.lat,
          lon: historyItem.lon,
        };

        const weather = transformWeatherData(cityData, weatherData);
        setCurrentWeather(weather);
        showSnackbar(SUCCESS_MESSAGES.WEATHER_LOADED, "success");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 p-4">
      <Container
        maxWidth="lg"
        className="flex flex-col md:flex-row md:items-stretch gap-6 ">
        <Box className="w-full md:w-2/5 flex" sx={{ height: "450px" }}>
          <Box
            className="w-full rounded-3xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 backdrop-blur-2xl border border-white/20 shadow-2xl p-6"
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}>
            <Box sx={{ flexShrink: 0 }}>
              <SearchBar
                value={inputData}
                onChange={handleInputChange}
                onSearch={handleButtonClick}
                isLoading={isLoading}
              />
            </Box>
            <Box sx={{ flex: 1, mt: 3, overflow: "hidden" }}>
              <HisoryList onItemClick={handleHistoryItemClick} />
            </Box>
          </Box>
        </Box>

        {isLoading ? (
          <WeatherCardSkeleton/>
        ) : (
          <WeatherCard weather={currentWeather} />
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
