'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Avenoir engine:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="max-w-md w-full bg-bg-surface border border-border-subtle rounded-3xl p-8 space-y-6 shadow-md">
            <div className="inline-flex p-4 bg-accent-primary-soft text-accent-primary rounded-full">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-text-primary tracking-tight">
                An unexpected error occurred
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                We&apos;re sorry for the inconvenience. Please try reloading the page to continue shopping.
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 w-full bg-accent-primary hover:bg-indigo-600 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
