import { Component, ReactNode } from "react";
import { Typography } from "@mui/material";
import Link from "./Link";

type ErrorBoundaryConfig = {
  profile: {
    communityTicketUrl: string;
    communityUrl: string;
    isPartnerPreview: boolean;
    helpdeskEmail?: string;
  };
};

type ErrorBoundaryProps = {
  children: ReactNode;
  config: ErrorBoundaryConfig;
  message?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

const defaultConfig: ErrorBoundaryConfig = {
  profile: {
    communityTicketUrl: "",
    communityUrl: "",
    isPartnerPreview: false,
  },
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static readonly defaultProps = {
    config: defaultConfig,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render(): ReactNode {
    const { children, config } = this.props;
    const { isPartnerPreview } = config.profile;
    const { hasError } = this.state;

    const {
      message = isPartnerPreview ? (
        // PPP error message
        <div>
          Something went wrong. Please contact Open Targets at{" "}
          <Link to={`mailto: ${config.profile.helpdeskEmail}`} external footer={false}>
            {config.profile.helpdeskEmail}
          </Link>
        </div>
      ) : (
        // public platform error message
        <div>
          Something went wrong. Please{" "}
          <Link to={config.profile.communityTicketUrl} external footer={false}>
            submit a bug report
          </Link>{" "}
          on the Open Targets Community ({config.profile.communityUrl})
        </div>
      ),
    } = this.props;

    return hasError ? (
      <Typography component="div" align="center" color="secondary" variant="caption">
        {message}
      </Typography>
    ) : (
      children
    );
  }
}

export default ErrorBoundary;
