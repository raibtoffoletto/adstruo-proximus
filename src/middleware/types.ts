import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export type Middleware = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse,
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;

export type MiddlewareFactory = (middleware: Middleware) => Middleware;

export type MiddlewareRoutes = {
  authApi: string;
  signIn: string;
  main: string;
};

export type MiddlewareI18n = {
  default: string;
  languages: string[];
};
