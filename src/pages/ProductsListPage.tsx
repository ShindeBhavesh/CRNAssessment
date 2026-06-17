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
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Link as RouterLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/api/services";
import { extractErrorMessage } from "@/lib/errors";
import { RoleGuard } from "@/components/RoleGuard";

export const ProductsListPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"productName" | "createdOn">("createdOn");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const queryKey = useMemo(
    () => ["products", page, pageSize, search, sortBy, sortDirection],
    [page, pageSize, search, sortBy, sortDirection]
  );

  const productsQuery = useQuery({
    queryKey,
    queryFn: () => productApi.list({ page, pageSize, search, sortBy, sortDirection }),
  });

  const deleteMutation = useMutation({
    mutationFn: productApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });

  const totalPages = productsQuery.data ? Math.ceil(productsQuery.data.total / pageSize) : 1;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Products
        </Typography>
        <RoleGuard roles={["Admin", "Manager"]}>
          <Button component={RouterLink} to="/products/create" variant="contained">
            Create Product
          </Button>
        </RoleGuard>
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField label="Search" value={search} onChange={(event) => setSearch(event.target.value)} />
        <TextField select label="Sort by" value={sortBy} onChange={(event) => setSortBy(event.target.value as "productName" | "createdOn") }>
          <MenuItem value="createdOn">Created On</MenuItem>
          <MenuItem value="productName">Name</MenuItem>
        </TextField>
        <TextField
          select
          label="Direction"
          value={sortDirection}
          onChange={(event) => setSortDirection(event.target.value as "asc" | "desc")}
        >
          <MenuItem value="asc">Asc</MenuItem>
          <MenuItem value="desc">Desc</MenuItem>
        </TextField>
      </Stack>

      {productsQuery.isLoading ? <CircularProgress /> : null}
      {productsQuery.isError ? <Alert severity="error">{extractErrorMessage(productsQuery.error)}</Alert> : null}

      {productsQuery.data ? (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsQuery.data.data.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.createdBy}</TableCell>
                  <TableCell>{new Date(product.createdOn).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton component={RouterLink} to={`/products/${product.id}`}>
                      <VisibilityRoundedIcon />
                    </IconButton>
                    <RoleGuard roles={["Admin", "Manager"]}>
                      <IconButton component={RouterLink} to={`/products/${product.id}/edit`}>
                        <EditRoundedIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteMutation.mutate(product.id)}>
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
