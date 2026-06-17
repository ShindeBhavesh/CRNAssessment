import { useState } from "react";
import {
  Alert,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/services";
import { useAppDispatch } from "@/store/hooks";
import { setSession } from "@/store/authSlice";
import { extractErrorMessage } from "@/lib/errors";
import type { UserRole } from "@/types/models";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Viewer");
  const [error, setError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (session) => {
      dispatch(setSession(session));
      navigate("/", { replace: true });
    },
    onError: (reason) => {
      setError(extractErrorMessage(reason, "Unable to register"));
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    registerMutation.mutate({ name, email, password, role });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={8} sx={{ p: 4 }}>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Create Account
          </Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField label="Full Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <TextField select label="Role" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Viewer">Viewer</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating account..." : "Register"}
          </Button>

          <Typography variant="body2">
            Already have an account? <RouterLink to="/login">Sign in</RouterLink>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};
