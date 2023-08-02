# @suplere/nhost-auth-helpers (BETA)

A collection of framework specific Auth utilities for working with Nhost.

## Supported Frameworks

- [Next.js](https://nextjs.org) [[Documentation](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)]

### Examples and Packages

- Examples
  - `@examples/nextjs`: a [Next.js](https://nextjs.org) app using App Router
  - `@examples/nextjs-pages`: a [Next.js](https://nextjs.org) app using Pages Router
- Packages
  - `@suplere/nhost-auth-helpers-nextjs`: the Nhost auth helper nextjs library used by `nextjs` application
  - `config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
  - `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Development & Contributing

Read the [development.md](./development.md) guide for more information on local setup, testing, and preparing a release.

Using a `@suplere/nhost-auth-helpers-[framework-name]` naming convention for packages

Thanks for inspiration of this package from [Supabase auth-helpers](https://github.com/supabase/auth-helpers)