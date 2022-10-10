
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { ErrorBoundary as ReactErrorBoundary } from "./ErrorBoundary";


type ErrorBoundaryProps = {
  children: JSX.Element
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  const [hasError, setHasError] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setHasError(false);
  }, [location.key]);

  return (
    <ReactErrorBoundary hasError={hasError} setHasError={setHasError}>{children}</ReactErrorBoundary>
  );
};
