
import WbSunny from "@mui/icons-material/WbSunny";
import Cloud from "@mui/icons-material/Cloud";
import CloudQueue from "@mui/icons-material/CloudQueue";
import Grain from "@mui/icons-material/Grain";
import AcUnit from "@mui/icons-material/AcUnit";
import Thunderstorm from "@mui/icons-material/Thunderstorm";
import Foggy from "@mui/icons-material/Foggy";

/**
 * Переделываем иконки из Апи в иконки MUI по их коду
 */

export const getWeatherIcon = (iconCode: string) => {
  const code = iconCode.slice(0, 2);

  const iconMap: Record<string, JSX.Element> = {
    "01": <WbSunny fontSize="inherit" sx={{ color: '#FDB813' }} />, // ясно - желтое солнце
    "02": <CloudQueue fontSize="inherit" sx={{ color: '#E0E7FF' }} />, // малооблачно - светло-серые облака
    "03": <Cloud fontSize="inherit" sx={{ color: '#CBD5E1' }} />, // облачно - серые облака
    "04": <Cloud fontSize="inherit" sx={{ color: '#94A3B8' }} />, // пасмурно - темно-серые облака
    "09": <Grain fontSize="inherit" sx={{ color: '#60A5FA' }} />, // ливень - синий дождь
    "10": <Grain fontSize="inherit" sx={{ color: '#3B82F6' }} />, // дождь - синий
    "11": <Thunderstorm fontSize="inherit" sx={{ color: '#8B5CF6' }} />, // гроза - фиолетовая
    "13": <AcUnit fontSize="inherit" sx={{ color: '#DBEAFE' }} />, // снег - голубой
    "50": <Foggy fontSize="inherit" sx={{ color: '#9CA3AF' }} />, // туман - серый
  };

  return iconMap[code] || <WbSunny fontSize="inherit" sx={{ color: '#FDB813' }} />;
};

/**
 * Маленькая иконка для описания погоды
 */
export const getSmallWeatherIcon = (iconCode: string) => {
  const code = iconCode.slice(0, 2);

  const iconMap: Record<string, JSX.Element> = {
    "01": <WbSunny fontSize="small" sx={{ color: '#FDB813' }} />,
    "02": <CloudQueue fontSize="small" sx={{ color: '#E0E7FF' }} />,
    "03": <Cloud fontSize="small" sx={{ color: '#CBD5E1' }} />,
    "04": <Cloud fontSize="small" sx={{ color: '#94A3B8' }} />,
    "09": <Grain fontSize="small" sx={{ color: '#60A5FA' }} />,
    "10": <Grain fontSize="small" sx={{ color: '#3B82F6' }} />,
    "11": <Thunderstorm fontSize="small" sx={{ color: '#8B5CF6' }} />,
    "13": <AcUnit fontSize="small" sx={{ color: '#DBEAFE' }} />,
    "50": <Foggy fontSize="small" sx={{ color: '#9CA3AF' }} />,
  };

  return iconMap[code] || <WbSunny fontSize="small" sx={{ color: '#FDB813' }} />;
};