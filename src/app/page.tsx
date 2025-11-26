"use client";

import React from "react";
import { useState } from "react";

import { Container, Box, Snackbar, Alert } from "@mui/material";

import { WeatherData } from "@/lib/types/weather.types";

import { fetchWeatherForCity } from "@/lib/api/weatherService";

import WeatherCard from "@/components/features/weather/WeatherCard";
import SearchBar from "@/components/features/search-history/SearchBar";
import HisoryList from "@/components/features/history-list/HistoryList";



export default function Home() {
  const [inputData, setInputData] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
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
            <SearchBar
              value={inputData}
              onChange={handleInputChange}
              onSearch={handleButtonClick}
              isLoading={isLoading}
            />
            <HisoryList/>
          </Box>
        </Box>

        <WeatherCard weather={currentWeather} />
      </Container>

      <Snackbar>
        <Alert></Alert>
      </Snackbar>
    </Box>
  );
}
