import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleMode } from "@/store/uiSlice";
import { clearSession } from "@/store/authSlice";
import { authApi } from "@/api/services";
import { useSnackbar } from "notistack";

const drawerWidth = 240;

const navigation = [
  { label: "Dashboard", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Items", path: "/items" },
];

export const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const session = useAppSelector((state) => state.auth.session);
  const mode = useAppSelector((state) => state.ui.mode);

  const handleLogout = async () => {
    const refreshToken = session?.tokens.refreshToken;
    if (refreshToken) {
      await authApi.logout(refreshToken);
    }
    dispatch(clearSession());
    enqueueSnackbar("Signed out successfully", { variant: "success" });
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Product Management System
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">{session?.user.name}</Typography>
            <IconButton color="inherit" onClick={() => dispatch(toggleMode())}>
              {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutRoundedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            PMS Admin
          </Typography>
        </Toolbar>
        <List>
          {navigation.map((item) => (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
