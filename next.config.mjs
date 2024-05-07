/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {};

export default withSentryConfig(
  nextConfig,
  {
    // https://github.com/getsentry/sentry-webpack-plugin#options
    silent: true,
    org: 'joost-schuur',
    project: 'coworking-party',
  },
  {
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
    widenClientFileUpload: true,
    transpileClientSDK: false,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: false,
  }
);
