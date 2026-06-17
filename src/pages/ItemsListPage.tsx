import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Link as RouterLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemApi, productApi } from "@/api/services";
import { extractErrorMessage } from "@/lib/errors";
import { RoleGuard } from "@/components/RoleGuard";

export const ItemsListPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [productId, setProductId] = useState<number | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const itemsQuery = useQuery({
    queryKey: ["items", page, pageSize, productId, sortDirection],
    queryFn: () =>
      itemApi.list({
        page,
        pageSize,
        sortDirection,
        productId: productId === "" ? undefined : Number(productId),
      }),
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

  const productsMap = useMemo(() => {
    const map = new Map<number, string>();
    productsQuery.data?.data.forEach((entry) => {
      map.set(entry.id, entry.productName);
    });
    return map;
  }, [productsQuery.data]);

  const deleteMutation = useMutation({
    mutationFn: itemApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["items"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });

  const totalPages = itemsQuery.data ? Math.ceil(itemsQuery.data.total / pageSize) : 1;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Items
        </Typography>
        <RoleGuard roles={["Admin", "Manager"]}>
          <Button component={RouterLink} to="/items/create" variant="contained">
            Create Item
          </Button>
        </RoleGuard>
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          select
          label="Product"
          value={productId}
          onChange={(event) => setProductId(event.target.value ? Number(event.target.value) : "")}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          {productsQuery.data?.data.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.productName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Sort"
          value={sortDirection}
          onChange={(event) => setSortDirection(event.target.value as "asc" | "desc")}
        >
          <MenuItem value="asc">Asc</MenuItem>
          <MenuItem value="desc">Desc</MenuItem>
        </TextField>
      </Stack>

      {itemsQuery.isLoading ? <CircularProgress /> : null}
      {itemsQuery.isError ? <Alert severity="error">{extractErrorMessage(itemsQuery.error)}</Alert> : null}

      {itemsQuery.data ? (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsQuery.data.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{productsMap.get(item.productId) ?? `#${item.productId}`}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell align="right">
                    <RoleGuard roles={["Admin", "Manager"]}>
                      <IconButton component={RouterLink} to={`/items/${item.id}/edit`}>
                        <EditRoundedIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteMutation.mutate(item.id)}>
                        <DeleteRoundedIcon />
                      </IconButton>
                    </RoleGuard>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : null}

      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Button disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
          Previous
        </Button>
        <Typography>
          Page {page} of {Math.max(totalPages, 1)}
        </Typography>
        <Button disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
          Next
        </Button>
        <TextField
          select
          size="small"
          label="Page Size"
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPage(1);
          }}
        >
          {[5, 10, 20].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
};
