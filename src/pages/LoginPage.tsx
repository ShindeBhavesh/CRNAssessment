import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/services";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/authSlice";
import { extractErrorMessage } from "@/lib/errors";

const demoAccounts = [
  { email: "admin@pms.local", password: "Admin@123", role: "Admin" },
  { email: "manager@pms.local", password: "Manager@123", role: "Manager" },
  { email: "viewer@pms.local", password: "Viewer@123", role: "Viewer" },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState(demoAccounts[0].email);
  const [password, setPassword] = useState(demoAccounts[0].password);
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (session) => {
      dispatch(setSession(session));
      const target = (location.state as { from?: string } | undefined)?.from ?? "/";
      navigate(target, { replace: true });
    },
    onError: (reason) => {
      setError(extractErrorMessage(reason, "Unable to sign in"));
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    loginMutation.mutate({ email, password });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={8} sx={{ p: 4 }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Product Management System
          </Typography>
          <Typography color="text.secondary">Sign in to continue.</Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button type="submit" variant="contained" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>

          <TextField
            select
            label="Quick Access"
            value={email}
            onChange={(event) => {
              const selected = demoAccounts.find((entry) => entry.email === event.target.value);
              if (selected) {
                setEmail(selected.email);
                setPassword(selected.password);
              }
            }}
          >
            {demoAccounts.map((entry) => (
              <MenuItem key={entry.email} value={entry.email}>
                {entry.role} ({entry.email})
              </MenuItem>
            ))}
          </TextField>

          <Box>
            <Typography variant="body2">
              New user? <RouterLink to="/register">Create an account</RouterLink>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};
