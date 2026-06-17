import { Alert, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { productApi } from "@/api/services";
import { extractErrorMessage } from "@/lib/errors";

export const ProductDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const productQuery = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getById(id),
    enabled: Number.isFinite(id),
  });

  if (productQuery.isLoading) {
    return <CircularProgress />;
  }

  if (productQuery.isError) {
    return <Alert severity="error">{extractErrorMessage(productQuery.error)}</Alert>;
  }

  const product = productQuery.data;
  if (!product) {
    return <Alert severity="warning">Product not found</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {product.productName}
        </Typography>
        <Typography>ID: {product.id}</Typography>
        <Typography>Created By: {product.createdBy}</Typography>
        <Typography>Created On: {new Date(product.createdOn).toLocaleString()}</Typography>
        <Typography>Modified By: {product.modifiedBy ?? "-"}</Typography>
        <Typography>Modified On: {product.modifiedOn ? new Date(product.modifiedOn).toLocaleString() : "-"}</Typography>
      </Stack>
    </Paper>
  );
};
