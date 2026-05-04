const SITE_URL_ENV_NAMES = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_APP_URL',
  'SITE_URL',
  'APP_URL',
  'VERCEL_PROJECT_PRODUCTION_URL',
  'VERCEL_URL',
];

function normalizeOrigin(value: string | undefined) {
  if (!value) {
    return null;
  }

  const withProtocol = value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;

  try {
    const url = new URL(withProtocol);
    return url.origin;
  } catch {
    return null;
  }
}

export function getConfiguredSiteOrigin() {
  for (const envName of SITE_URL_ENV_NAMES) {
    const origin = normalizeOrigin(process.env[envName]);

    if (origin) {
      return origin;
    }
  }

  return null;
}

export function getRequestOrigin(request: Request) {
  const configuredOrigin = getConfiguredSiteOrigin();

  if (configuredOrigin) {
    return configuredOrigin;
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost ?? request.headers.get('host');

  if (host) {
    const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
    const protocol = forwardedProto || (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https');
    return `${protocol}://${host}`;
  }

  return new URL(request.url).origin;
}

export function siteUrl(path: string, request: Request) {
  return new URL(path, getRequestOrigin(request));
}
