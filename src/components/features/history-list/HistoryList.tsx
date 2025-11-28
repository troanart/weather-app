import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { useHistoryStore } from "@/lib/stores/historyStore";
import { INFO_MESSAGES, BUTTON_LABELS, DIALOG_MESSAGES } from "@/lib/constants/messages.constants";
import { SearchHistoryItem } from "@/lib/types/weather.types";

interface HistoryListProps {
  onItemClick?: (lat: number, lon: number) => void;
}

export default function HistoryList({ onItemClick }: HistoryListProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });
  const [deletedItems, setDeletedItems] = useState<SearchHistoryItem[]>([]);
  
  const history = useHistoryStore((state) => state.history);
  const removeFromHistory = useHistoryStore((state) => state.removeFromHistory);
  const addToHistory = useHistoryStore((state) => state.addToHistory);

  const handleItemClick = async (lat: number, lon: number) => {
    if (onItemClick) {
      onItemClick(lat, lon);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, id });

  };

  const confirmDelete = () => {
    if (deleteDialog.id) {
      const itemToDelete = history.find((item) => item.id === deleteDialog.id);
      if (itemToDelete) {
        setDeletedItems((prev) => [itemToDelete, ...prev]);
        removeFromHistory(deleteDialog.id);
      }
    }
    setDeleteDialog({ open: false, id: null });
  };

  const handleRestore = () => {
    if (deletedItems.length === 0) return;
    
    const lastDeleted = deletedItems[0];
    addToHistory({
      city: lastDeleted.city,
      country: lastDeleted.country,
      lat: lastDeleted.lat,
      lon: lastDeleted.lon,
    });
    
    setDeletedItems((prev) => prev.slice(1));
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
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between" 
          }}>
          <Typography
            sx={{ fontSize: "1.25rem", fontWeight: 600, lineHeight: 1 }}>
            История поиска
          </Typography>
          {deletedItems.length > 0 && (
            <IconButton
              onClick={handleRestore}
              size="small"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": { color: "rgba(255, 255, 255, 1)" },
              }}>
              <RestoreIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box 
        sx={{ 
          flexShrink: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between" 
        }}>
        <Typography
          sx={{ fontSize: "1.25rem", fontWeight: 600, lineHeight: 1 }}>
          История поиска
        </Typography>
        {deletedItems.length > 0 && (
          <IconButton
            onClick={handleRestore}
            size="small"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": { color: "rgba(255, 255, 255, 1)" },
            }}>
            <RestoreIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Box
        className="space-y-2 mt-3"
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.3)",
            },
          },
        }}>
        {history.map((item) => (
          <Box
            key={item.id}
            onClick={() => handleItemClick(item.lat, item.lon)}
            className="rounded-2xl bg-white/5 hover:bg-white/10 px-4 py-3 text-sm text-white/80 cursor-pointer transition flex items-center justify-between group mr-2">
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
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(99, 102, 241, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            color: "white",
          }
        }}>
        <DialogTitle sx={{ color: "white", fontWeight: 600 }}>
          {DIALOG_MESSAGES.DELETE_TITLE}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
            {DIALOG_MESSAGES.DELETE_CONFIRMATION}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, id: null })}
            sx={{ 
              color: "white",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" }
            }}>
            {BUTTON_LABELS.CANCEL}
          </Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained"
            sx={{ 
              bgcolor: "rgba(239, 68, 68, 0.9)",
              "&:hover": { bgcolor: "rgba(220, 38, 38, 1)" }
            }}>
            {BUTTON_LABELS.DELETE}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
