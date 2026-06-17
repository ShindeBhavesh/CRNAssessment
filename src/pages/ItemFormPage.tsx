import { useEffect, useState } from "react";
import { Alert, Button, CircularProgress, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { itemApi, productApi } from "@/api/services";
import { extractErrorMessage } from "@/lib/errors";

export const ItemFormPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id ? Number(params.id) : undefined;
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [productId, setProductId] = useState<number>(1);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const itemQuery = useQuery({
    queryKey: ["item", id],
    queryFn: () => itemApi.getById(id ?? 0),
    enabled: isEdit,
  });

  const productsQuery = useQuery({
    queryKey: ["products", "all"],
    queryFn: () =>
      productApi.list({
        page: 1,
        pageSize: 100,
        search: "",
        sortBy: "productName",
        sortDirection: "asc",
      }),
  });

  useEffect(() => {
    if (itemQuery.data) {
      setProductId(itemQuery.data.productId);
      setQuantity(itemQuery.data.quantity);
      return;
    }

    const firstProduct = productsQuery.data?.data[0];
    if (firstProduct && !isEdit) {
      setProductId(firstProduct.id);
    }
  }, [isEdit, itemQuery.data, productsQuery.data]);

  const createMutation = useMutation({
    mutationFn: itemApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["items"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      navigate("/items");
    },
    onError: (reason) => setError(extractErrorMessage(reason)),
  });

  const updateMutation = useMutation({
    mutationFn: (newQuantity: number) => itemApi.update(id ?? 0, { quantity: newQuantity }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["items"] });
      navigate("/items");
    },
    onError: (reason) => setError(extractErrorMessage(reason)),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (isEdit) {
      updateMutation.mutate(quantity);
      return;
    }
    createMutation.mutate({ productId, quantity });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Paper sx={{ p: 3, maxWidth: 640 }}>
      <Stack spacing={2} component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {isEdit ? "Edit Item" : "Create Item"}
        </Typography>
        {(itemQuery.isLoading || productsQuery.isLoading) ? <CircularProgress /> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}

        {!isEdit ? (
          <TextField
            select
            label="Product"
            value={productId}
            onChange={(event) => setProductId(Number(event.target.value))}
            required
          >
            {productsQuery.data?.data.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.productName}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          required
        />

        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={isPending || productsQuery.isLoading || itemQuery.isLoading}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button component={RouterLink} to="/items" variant="outlined">
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
