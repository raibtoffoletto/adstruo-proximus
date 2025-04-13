# AdstruoProximus

> Helper library for my NextJS projects: single user and self hosted apps.

## Middlewares

By default, this package includes an authentication middleware, a route based language switcher middleware and a factory helper to circunvent the fact that, currently, NextJS only supports one middleware configuration file.

### Setup

In your `/middleware.ts` import the necessary dependencies from this package. Then register the middlewares in the factory with the proper configuration.

Example:

```ts
import { auth, configuration, factory, i18n } from 'adstruo-proximus/middleware';

export const config = { ...configuration };

const languages = {
  default: 'en',
  languages: ['en', 'fr', 'de', 'it'],
};

const routes = {
  authApi: '/api/auth',
  signIn: '/signIn',
  main: '/',
};

export default factory([i18n(languages), auth(routes)]);
```

The `i18n` module needs a default language to fallback and a list of languages that will be appended in the URL on runtime.

The `auth` modules needs to know a few routes: the protected main page and the public sign in page and api endpoint. It also needs to have set up these environment variables in the project's `/.env`

```bash
APP_PASSWORD="password"         # the sign in password
JWT_KEY="your-secret-key"       # unique key to encript session
JWT_ISSUER="your-issuer"        # JWT unique issuer
JWT_AUDIENCE="your-audience"    # JWT unique audience
```

The JWT key should be 32 character long. One easy way generated it is with this command: `openssl rand -base64 24`.
