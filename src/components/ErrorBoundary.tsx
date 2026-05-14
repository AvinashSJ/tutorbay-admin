"use client";

import { Component, createElement } from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return createElement(
        "div",
        {
          className:
            "d-flex flex-column align-items-center justify-content-center text-center py-48 px-16",
        },
        createElement(
          "div",
          { className: "mb-24" },
          createElement("i", {
            className: "ri-error-warning-line text-danger",
            style: { fontSize: "3rem" },
          }),
        ),
        createElement(
          "h4",
          { className: "fw-semibold mb-8" },
          "Something went wrong",
        ),
        createElement(
          "p",
          { className: "text-secondary-light mb-24" },
          this.state.error?.message ?? "An unexpected error occurred.",
        ),
        createElement(
          "button",
          {
            type: "button",
            className:
              "btn btn-primary-600 radius-8 px-20 py-11 d-inline-flex align-items-center gap-2",
            onClick: this.handleRetry,
          },
          createElement("i", { className: "ri-refresh-line" }),
          " Try Again",
        ),
      );
    }

    return this.props.children;
  }
}
