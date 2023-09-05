import { Component } from "react";
import { Typography } from "@mui/material";
import config from "../config";
import Link from "./Link";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { isPartnerPreview } = config.profile;
    const { hasError } = this.state;
    const { children } = this.props;

    const {
      message = isPartnerPreview ? (
        // PPP error message
        <div>
          Something went wrong. Please contact Open Targets at{" "}
          <Link to={`mailto: ${config.profile.helpdeskEmail}`} external>
            {config.profile.helpdeskEmail}
          </Link>
        </div>
      ) : (
        // public platform error message
        <div>
          Something went wrong. Please{" "}
          <Link to={config.profile.communityTicketUrl} external>
            submit a bug report
          </Link>{" "}
          on the Open Targets Community ({config.profile.communityUrl})
        </div>
      ),
    } = this.props;

    return hasError ? (
      <Typography
        component="div"
        align="center"
        color="secondary"
        variant="caption"
      >
        {message}
      </Typography>
    ) : (
      children
    );
  }
}

export default ErrorBoundary;
