import { Box, Typography } from "@mui/material";

export default function HisoryList() {
  return (
    <Box>
      <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, lineHeight: 1 }}>
        История поиска
      </Typography>
      <Box className="space-y-2 mt-3">
        <Box className="rounded-2xl bg-white/5 hover:bg-white/10 px-4 py-3 text-sm text-white/80 cursor-pointer transition">
          <Typography variant="body2">История будет здесь</Typography>
        </Box>
      </Box>
    </Box>
  );
}
