import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

class ScrollToTop extends Component<RouteComponentProps> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps: RouteComponentProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
