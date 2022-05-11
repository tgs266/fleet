import React from 'react';

class FillErrorBoundary extends React.Component<
    { children: React.ReactNode; errorComponent: JSX.Element },
    { hasError: boolean }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.errorComponent;
        }

        return this.props.children;
    }
}

export default FillErrorBoundary;
