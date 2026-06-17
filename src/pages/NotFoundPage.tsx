import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const NotFoundPage = () => (
  <Box sx={{ py: 8, textAlign: "center" }}>
    <Typography variant="h3" sx={{ fontWeight: 700 }}>
      404
    </Typography>
    <Typography sx={{ mb: 2 }}>Page not found.</Typography>
    <Button variant="contained" component={RouterLink} to="/">
      Back to Dashboard
    </Button>
  </Box>
);
