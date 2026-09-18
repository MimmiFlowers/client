import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
                    <h1 className="mb-4 font-[var(--font-display)] text-3xl text-[var(--color-ink)]">
                        Something went wrong
                    </h1>
                    <p className="mb-6 text-[var(--color-fg-mid)]">
                        An unexpected error occurred. Please try refreshing the
                        page.
                    </p>
                    <button
                        className="btn-primary hover:btn-primary-hover px-6 py-3"
                        onClick={() => window.location.reload()}
                    >
                        Refresh page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
