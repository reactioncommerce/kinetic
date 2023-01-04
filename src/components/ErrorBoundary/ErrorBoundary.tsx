import { Component } from "react";
import Typography from "@mui/material/Typography";

import { formatErrorResponse, isNetworkError } from "@utils/errorHandlers";
import { ErrorCode } from "types/common";

import { AccessDenied } from "./AccessDenied";
import { GeneralError } from "./GeneralError";

type Props = {
   children: JSX.Element,
   hasError: boolean,
   setHasError: (hasError: boolean) => void
   fallback?: JSX.Element
  }

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
    this.props.setHasError(true);
    if (isNetworkError(error)) {
      this.setState({
        errorElement:
        <GeneralError
          title="Network Error"
          description="There is an issue when connecting to the API. Please check your API server and try again."
        />
      });
      return;
    }
    const { code } = formatErrorResponse(error);


    if (this.props.fallback) {
      this.setState({ errorElement: this.props.fallback });
      return;
    }

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
