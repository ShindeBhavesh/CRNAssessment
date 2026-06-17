import { useQuery } from "@tanstack/react-query";
import { Alert, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { dashboardApi } from "@/api/services";
import { extractErrorMessage } from "@/lib/errors";

export const DashboardPage = () => {
  const summaryQuery = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardApi.summary,
  });

  if (summaryQuery.isLoading) {
    return <CircularProgress />;
  }

  if (summaryQuery.isError) {
    return <Alert severity="error">{extractErrorMessage(summaryQuery.error)}</Alert>;
  }

  if (!summaryQuery.data) {
    return <Alert severity="warning">No dashboard data available.</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Dashboard
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Products: {summaryQuery.data.productCount}</Typography>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Items: {summaryQuery.data.itemCount}</Typography>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Low Stock Items: {summaryQuery.data.lowStockItems}</Typography>
      </Paper>
    </Stack>
  );
};
