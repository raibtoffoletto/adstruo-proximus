import { COOKIE as AUTH_COOKIE } from '@lib/auth';
import { NextResponse } from 'next/server';
import { Middleware, MiddlewareI18n } from './types';

export const COOKIE = `${AUTH_COOKIE}-lang`;

export default function middleware(
  LANG: MiddlewareI18n,
): (next: Middleware) => Middleware {
  return (next: Middleware): Middleware =>
    async (request, event, response) => {
      const isApi = /^\/api/i.test(request.nextUrl.pathname);

      const lang = request.cookies.get(COOKIE)?.value || LANG.default;

      if (!isApi && !request.nextUrl.pathname.startsWith(`/${lang}`)) {
        const nextLang = LANG.languages.find((l) =>
          request.nextUrl.pathname.startsWith(`/${l}`),
        );

        const redirect = !!nextLang
          ? request.nextUrl.pathname.replace(lang, nextLang)
          : `/${lang}${request.nextUrl.pathname}`;

        const _response = NextResponse.redirect(new URL(redirect, request.url));

        _response.cookies.set(COOKIE, nextLang || lang);

        return _response;
      }

      return next(request, event, response);
    };
}
