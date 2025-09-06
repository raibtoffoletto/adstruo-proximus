import { COOKIE, validateCookie, validateToken } from '@lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { Middleware, MiddlewareRoutes } from './types';

function isPublic(request: NextRequest, isAuthorized: boolean, routes: MiddlewareRoutes) {
  const isSignInAPI =
    request.method === 'POST' && request.nextUrl.pathname === routes.authApi;

  const isSignInPage =
    new RegExp(`/[^/]+${routes.signIn}`).test(request.nextUrl.pathname) && !isAuthorized;

  return isSignInAPI || isSignInPage;
}

async function authorize(request: NextRequest) {
  const { value: cookie } = request.cookies.get(COOKIE) || {};

  const header = `${request.headers.get('Authorization') || ''}`;
  const [_, prefix, token] = header.match(/^(bearer\s)(.*)$/i) || [];

  const isCookieAuthorized = !!cookie && (await validateCookie(cookie));
  const isTokenAuthorized = !!prefix && !!token && (await validateToken(token));

  return isCookieAuthorized || isTokenAuthorized;
}

export default function middleware(
  routes: MiddlewareRoutes,
): (next: Middleware) => Middleware {
  return (next: Middleware): Middleware =>
    async (request, event, response) => {
      const isAuthorized = await authorize(request);
      const isApi = /^\/api/i.test(request.nextUrl.pathname);

      if (isPublic(request, isAuthorized, routes)) {
        return next(request, event, response);
      }

      if (isAuthorized) {
        if (request.nextUrl.pathname === routes.signIn && !isApi) {
          return NextResponse.redirect(new URL(routes.main, request.url));
        }

        return next(request, event, response);
      }

      if (isApi) {
        return new Response(null, { status: 401 });
      }

      return NextResponse.redirect(new URL(routes.signIn, request.url));
    };
}
