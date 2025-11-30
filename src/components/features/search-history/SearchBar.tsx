import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Button } from "@/components/ui/Button";
import { SearchBarProps } from "@/lib/types/components.types";
import { PLACEHOLDERS, ERROR_MESSAGES } from "@/lib/constants/messages.constants";
import { UI_CONFIG } from "@/lib/constants/ui.constants";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { getCityCoordinates } from "@/lib/api/weatherApi";
import { CityGeoData } from "@/lib/types/weather.types";

export default function SearchBar(props: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<CityGeoData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const debouncedValue = useDebounce(props.value, 400);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Закрываем suggestions при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Загружаем предложения городов при изменении debounced значения
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedValue.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setIsLoadingSuggestions(true);
        const cities = await getCityCoordinates(debouncedValue);
        setSuggestions(cities.slice(0, UI_CONFIG.MAX_SUGGESTIONS));
        setShowSuggestions(cities.length > 0);
      } catch (error) {
        console.error(ERROR_MESSAGES.CITIES_LOAD_ERROR, error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  const handleSuggestionClick = (city: CityGeoData) => {
    props.onChange({
      target: { value: `${city.name}, ${city.country}` },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowSuggestions(false);
    // Автоматически начинаем поиск с задержкой для обновления состояния input
    setTimeout(() => props.onSearch(), UI_CONFIG.AUTO_SEARCH_DELAY);
  };

  return (
    <Box ref={wrapperRef} sx={{ position: "relative" }}>
      <Typography sx={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1 }}>
        Поиск города
      </Typography>
      <Box className="flex flex-col md:flex-row gap-3 mt-3">
        <Box sx={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            value={props.value}
            onChange={(e) => {
              props.onChange(e);
              if (e.target.value.trim().length >= 2) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !props.isLoading && props.value.trim()) {
                props.onSearch();
                setShowSuggestions(false);
              }
              if (e.key === "Escape") {
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={PLACEHOLDERS.SEARCH_INPUT}
            className="w-full rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 transition"
          />
          
          {/* Автокомплит список */}
          {showSuggestions && suggestions.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                bgcolor: "rgba(139, 92, 246, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "16px",
                overflow: "hidden",
                zIndex: 1000,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}>
              <List sx={{ p: 0 }}>
                {suggestions.map((city, index) => (
                  <ListItem key={`${city.lat}-${city.lon}-${index}`} sx={{ p: 0 }}>
                    <ListItemButton
                      onClick={() => handleSuggestionClick(city)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: "rgba(255, 255, 255, 0.7)" }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                            {city.name}
                          </Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>
                            {city.country}
                            {city.state ? `, ${city.state}` : ""}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Индикатор загрузки suggestions */}
          {isLoadingSuggestions && props.value.trim().length >= 2 && (
            <Box
              sx={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
              }}>
              <CircularProgress size={16} sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
            </Box>
          )}
        </Box>
        
        <Button onClick={props.onSearch} disabled={props.isLoading}>
          {props.isLoading ? (
            "..."
          ) : (
            <SearchIcon sx={{ fontSize: 20, color: "white" }} />
          )}
        </Button>
      </Box>
    </Box>
  );
}
