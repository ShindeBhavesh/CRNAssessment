import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardPage } from "@/pages/DashboardPage";
import { ItemFormPage } from "@/pages/ItemFormPage";
import { ItemsListPage } from "@/pages/ItemsListPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductDetailsPage } from "@/pages/ProductDetailsPage";
import { ProductFormPage } from "@/pages/ProductFormPage";
import { ProductsListPage } from "@/pages/ProductsListPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { useAppSelector } from "@/store/hooks";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/products", element: <ProductsListPage /> },
          { path: "/products/create", element: <ProductFormPage /> },
          { path: "/products/:id", element: <ProductDetailsPage /> },
          { path: "/products/:id/edit", element: <ProductFormPage /> },
          { path: "/items", element: <ItemsListPage /> },
          { path: "/items/create", element: <ItemFormPage /> },
          { path: "/items/:id/edit", element: <ItemFormPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

const AppInner = () => {
  const mode = useAppSelector((state) => state.ui.mode);
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: "#0057ff",
      },
    },
    shape: {
      borderRadius: 10,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
