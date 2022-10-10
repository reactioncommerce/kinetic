import { Component } from "react";
import Typography from "@mui/material/Typography";

import { formatErrorResponse } from "@utils/errorHandlers";
import { ErrorCode } from "types/common";

import { AccessDenied } from "./AccessDenied";

type Props = {children: JSX.Element, hasError: boolean, setHasError: (hasError: boolean) => void}

const errorCodeMap: Record<string, JSX.Element> = {
  [ErrorCode.Forbidden]: <AccessDenied/>
};

export class ErrorBoundary extends Component<Props, {hasError: boolean, errorElement?: JSX.Element } > {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    const { code } = formatErrorResponse(error);

    this.props.setHasError(true);
    this.setState({ errorElement: code ? errorCodeMap[code] : undefined });
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.props.hasError && prevProps.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.state.errorElement ?? <Typography>Something went wrong</Typography>;
    }

    return this.props.children;
  }
}
