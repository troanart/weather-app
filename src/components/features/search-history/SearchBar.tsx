



import {
  Box,
  Typography,
  
} from "@mui/material";


import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@/components/ui/Button";
import { SearchBarProps } from "@/lib/types/components.types";


export default function SearchBar(props: SearchBarProps) {
  return (
    <Box>
      <Typography sx={{ fontSize: "1.75rem", fontWeight: 600, lineHeight: 1 }}>
        Поиск города
      </Typography>
      <Box className="flex gap-3 mt-3">
        <input
          type="text"
          value={props.value}
          onChange={props.onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !props.isLoading && props.value.trim()) {
              props.onSearch();
            }
          }}
          placeholder="Введите название города"
          className="flex-1 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40 transition"
        />
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