import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, AlertTitle, Box, Button } from "@mui/material";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(_: Error, __: ErrorInfo): void {
    // noop in this frontend-only build, but hook is intentionally kept for Sentry-like extensions.
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4 }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                Reload
              </Button>
            }
          >
            <AlertTitle>Something went wrong</AlertTitle>
            The application encountered an unexpected error.
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}
