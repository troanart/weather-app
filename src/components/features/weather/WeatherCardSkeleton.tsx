import { Box, Skeleton } from "@mui/material";

export default function WeatherCardSkeleton() {
  return (
    <Box className="w-full md:w-3/5 flex ">
      <Box className="w-full rounded-3xl bg-gradient-to-br from-purple-600/50 to-blue-600/50 backdrop-blur-2xl border border-white/20 shadow-2xl p-6 md:p-8 text-white relative overflow-hidden ">
        {/* Декоративные элементы */}
        <Box className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <Box className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <Box className="relative space-y-6 ">
          <Box>
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
            />
          </Box>

          <Box className="flex items-center justify-between">
            <Box>
              <Box className="flex items-center gap-3">
                <Skeleton
                  variant="circular"
                  width={80}
                  height={80}
                  sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                />
                <Skeleton
                  variant="text"
                  width={120}
                  height={60}
                  sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                />
              </Box>
            </Box>

            <Box className=" ">
              <Skeleton
                variant="text"
                width="50%"
                height={40}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
              />
            </Box>
          </Box>

          <Box className="flex items-center justify-around rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-4">
            <Box className="text-center">
              <Skeleton
                variant="text"
                width={40}
                height={20}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
              />
              <Skeleton
                variant="text"
                width={50}
                height={30}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
              />
            </Box>
            <Box className="h-8 w-px bg-white/30" />
            <Box className="text-center">
              <Skeleton
                variant="text"
                width={40}
                height={20}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
              />
              <Skeleton
                variant="text"
                width={50}
                height={30}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
              />
            </Box>
          </Box>

          <Skeleton
            variant="rectangular"
            width="100%"
            height={60}
            sx={{ borderRadius: 4, bgcolor: "rgba(255, 255, 255, 0.1)" }}
          />

          <Box className="grid grid-cols-2 gap-4">
            <Box>
              <Skeleton
                variant="text"
                width="60%"
                height={20}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
              />
              <Skeleton
                variant="text"
                width="40%"
                height={40}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
              />
            </Box>
            <Box className="text-right">
              <Skeleton
                variant="text"
                width="60%"
                height={20}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", ml: "auto" }}
              />
              <Skeleton
                variant="text"
                width="70%"
                height={40}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", ml: "auto" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
