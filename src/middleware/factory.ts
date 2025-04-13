import { Middleware, MiddlewareFactory } from './types';

export default function factory(
  middlewares: MiddlewareFactory[] = [],
  index = 0,
): Middleware {
  if (index === middlewares.length) {
    return (_, ___, response) => response;
  }

  return middlewares[index](factory(middlewares, index + 1));
}
