'use client'
import {
  Container,
  Box,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";


export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Box>
          <Box>
            {/* 
              Сделать отдельным компонентом 
            */}
            <input type="text" />
            {/* 
              Сделать отдельным компонентом 
            */}
            <button>Найти</button>
          </Box>
          <Grid>
            {/* 
              Сделать отдельным компонентом 
            */}

            <div>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: "bold", color: "white" }}>
                История поиска
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 1,
                    p: 1.5,
                    color: "white",
                  }}>
                  <Typography variant="body2">История будет здесь</Typography>
                </Box>
              </Box>
            </div>
          </Grid>
        </Box>
        <Grid>
          <Grid>
            {/* 
              Сделать отдельным компонентом 
            */}
            <div>
              <Box>
                <Typography>Дата и время</Typography>
                <Typography>Описание погоды</Typography>

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Typography>☁️</Typography>
                    <Typography>8°C</Typography>
                  </Box>

                  <Typography>New York, USA</Typography>
                </Box>
                <Box>
                  <Box>
                    <Typography>Влажность</Typography>
                    <Typography>68%</Typography>
                  </Box>
                  <Box>
                    <Typography>Ветер</Typography>
                    <Typography>12 km/h</Typography>
                  </Box>
                </Box>
              </Box>
            </div>
          </Grid>
        </Grid>
      </Container>

      <Snackbar>
        <Alert></Alert>
      </Snackbar>
    </Box>
  );
}
