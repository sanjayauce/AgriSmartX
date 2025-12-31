import React from 'react';
import { withTranslation } from 'react-i18next';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    const { t, i18n } = this.props;
    if (this.state.hasError) {
      // Debug log for language and translation
      console.log('ErrorBoundary language:', i18n.language, 'errorTitle:', t('errorBoundary.title'));
      return (
        <div className="error-boundary">
          <h2>{t('errorBoundary.title')}</h2>
          <p>{t('errorBoundary.description')}</p>
          <button onClick={() => window.location.reload()}>
            {t('errorBoundary.refresh')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary); 