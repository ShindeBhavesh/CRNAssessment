import { useEffect, useState } from "react";
import { Alert, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { productApi } from "@/api/services";
import { extractErrorMessage } from "@/lib/errors";

export const ProductFormPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id ? Number(params.id) : undefined;
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [productName, setProductName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const productQuery = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getById(id ?? 0),
    enabled: isEdit,
  });

  useEffect(() => {
    if (productQuery.data) {
      setProductName(productQuery.data.productName);
    }
  }, [productQuery.data]);

  const createMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      navigate("/products");
    },
    onError: (reason) => setError(extractErrorMessage(reason)),
  });

  const updateMutation = useMutation({
    mutationFn: (name: string) => productApi.update(id ?? 0, { productName: name }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["product", id] });
      navigate("/products");
    },
    onError: (reason) => setError(extractErrorMessage(reason)),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (isEdit) {
      updateMutation.mutate(productName);
      return;
    }
    createMutation.mutate({ productName });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Paper sx={{ p: 3, maxWidth: 640 }}>
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {isEdit ? "Edit Product" : "Create Product"}
        </Typography>
        {productQuery.isLoading ? <CircularProgress /> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          label="Product Name"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
          required
          disabled={productQuery.isLoading}
        />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={isPending || productQuery.isLoading}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button component={RouterLink} to="/products" variant="outlined">
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
