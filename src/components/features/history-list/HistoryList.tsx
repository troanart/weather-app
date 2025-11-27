import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useHistoryStore } from "@/lib/stores/historyStore";
import { INFO_MESSAGES } from "@/lib/constants/messages.constants";

interface HistoryListProps {
  onItemClick?: (lat: number, lon: number) => void;
}

export default function HistoryList({ onItemClick }: HistoryListProps) {
  const history = useHistoryStore((state) => state.history);
  const removeFromHistory = useHistoryStore((state) => state.removeFromHistory);

  const handleItemClick = async (lat: number, lon: number) => {
    if (onItemClick) {
      onItemClick(lat, lon);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Останавливаем всплытие события
    removeFromHistory(id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (history.length === 0) {
    return (
      <Box>
        <Typography
          sx={{ fontSize: "1.25rem", fontWeight: 600, lineHeight: 1 }}>
          История поиска
        </Typography>
        <Box className="mt-3">
          <Typography
            sx={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.5)" }}>
            {INFO_MESSAGES.NO_HISTORY}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexShrink: 0 }}>
        <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, lineHeight: 1 }}>
          История поиска
        </Typography>
      </Box>
      <Box 
        className="space-y-2 mt-3"
        sx={{ 
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          },
        }}>
        {history.map((item) => (
          <Box
            key={item.id}
            onClick={() => handleItemClick(item.lat, item.lon)}
            className="rounded-2xl bg-white/5 hover:bg-white/10 px-4 py-3 text-sm text-white/80 cursor-pointer transition flex items-center justify-between group">
            <Box>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                {item.city}, {item.country}
              </Typography>
              <Typography
                sx={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)" }}>
                {formatDate(item.searchedAt)}
              </Typography>
            </Box>
            <IconButton
              onClick={(e) => handleDelete(e, item.id)}
              size="small"
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                "&:hover": { color: "rgba(255, 255, 255, 0.9)" },
                opacity: 0,
                transition: "opacity 0.2s",
                ".group:hover &": { opacity: 1 },
              }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
