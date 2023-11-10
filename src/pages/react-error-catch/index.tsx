import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorComponent from './components/ErrorComponent';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: (...args: Array<unknown>) => void;
}

const ReactErrorCatch = () => {
  const renderErrorUI: React.FC<FallbackProps> = ({
    error,
    resetErrorBoundary,
  }) => {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    );
  };

  return (
    <ErrorBoundary
      // FallbackComponent={renderErrorUI}
      fallbackRender={renderErrorUI}
      onReset={() => {
        console.log('ss');
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <ErrorComponent />
    </ErrorBoundary>
  );
};

export default ReactErrorCatch;
