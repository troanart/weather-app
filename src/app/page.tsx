"use client";

import React, { useEffect } from "react";

import { Container, Box, Snackbar, Alert } from "@mui/material";

import { SUCCESS_MESSAGES } from "@/lib/constants/messages.constants";
import { useHistoryStore } from "@/lib/stores/historyStore";
import { useWeather } from "@/lib/hooks/useWeather";
import { useSnackbar } from "@/lib/hooks/useSnackbar";
import { useWeatherSearch } from "@/lib/hooks/useWeatherSearch";
import { extractErrorMessage } from "@/lib/utils/errorHandler";

import WeatherCard from "@/components/features/weather/WeatherCard";
import SearchBar from "@/components/features/search-history/SearchBar";
import HistoryList from "@/components/features/history-list/HistoryList";
import WeatherCardSkeleton from "@/components/features/weather/WeatherCardSkeleton";

export default function Home() {
  const { weather, isLoading, searchWeather, loadWeatherByCoordinates } = useWeather();
  const snackbar = useSnackbar();
  const {
    inputValue,
    validationError,
    isSearching,
    handleInputChange,
    handleSearch,
  } = useWeatherSearch();

  const initializeHistory = useHistoryStore((state) => state.initializeHistory);

  // Инициализация истории из localStorage после монтирования (только на клиенте)
  useEffect(() => {
    initializeHistory();
  }, [initializeHistory]);

  /**
   * Обработка поиска погоды
   */
  const handleButtonClick = async () => {
    await handleSearch(async () => {
      try {
        await searchWeather(inputValue.trim());
        snackbar.show(SUCCESS_MESSAGES.WEATHER_LOADED, "success");
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        snackbar.show(errorMessage, "error");
        console.error("Ошибка при загрузке погоды:", error);
      }
    });
  };

  /**
   * Обработка клика по элементу истории
   */
  const handleHistoryItemClick = async (lat: number, lon: number) => {
    try {
      await loadWeatherByCoordinates(lat, lon);
      snackbar.show(SUCCESS_MESSAGES.WEATHER_LOADED, "success");
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      snackbar.show(errorMessage, "error");
      console.error("Ошибка при загрузке погоды:", error);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 p-4">
      <Container
        maxWidth="lg"
        className="flex flex-col lg:flex-row md:items-start  gap-6 ">
        <Box className="w-full lg:w-2/5 flex" >
          <Box
            className="w-full rounded-3xl bg-gradient-to-br from-purple-600/40 to-indigo-600/40 backdrop-blur-2xl border border-white/20 shadow-2xl p-6"
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              
            }}>
            <Box sx={{ flexShrink: 0 }}>
              <SearchBar
                value={inputValue}
                onChange={handleInputChange}
                onSearch={handleButtonClick}
                isLoading={isSearching}
              />
              {validationError && (
                <Box
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "error.main",
                    color: "error.contrastText",
                    fontSize: "0.875rem",
                  }}>
                  {validationError}
                </Box>
              )}
            </Box>
            <Box sx={{ flex: 1, mt: 3, overflow: "hidden" }}>
              <HistoryList onItemClick={handleHistoryItemClick} />
            </Box>
          </Box>
        </Box>

        {isLoading && !weather ? (
          <WeatherCardSkeleton />
        ) : (
          <WeatherCard weather={weather} isLoading={isLoading} />
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={snackbar.close}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert
          onClose={snackbar.close}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
