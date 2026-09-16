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
                <div className="flex min-h-dvh flex-col items-center justify-center bg-blush px-5 text-center text-ink">
                    <h1 className="mb-4 font-display text-4xl">
                        Something went wrong
                    </h1>
                    <p className="mb-8 max-w-sm text-ink-soft">
                        An unexpected error occurred. Please try refreshing the
                        page.
                    </p>
                    <button
                        className="h-14 cursor-pointer rounded-full bg-ink px-8 text-[12px] font-medium tracking-[0.18em] text-blush uppercase active:scale-[0.98]"
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
