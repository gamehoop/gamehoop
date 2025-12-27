# gamehoop

The easy to use tools to build and scale your games.

## Quick Start

Prerequisites: Install [Node](https://nodejs.org), [pnpm](https://pnpm.io), and [Docker](https://www.docker.com).

Populate the missing environment variables:

`cp .env .env.local`

Install the dependencies:

`pnpm install`

Start the database:

`docker compose up -d`

Apply database schema changes:

`pnpm db:migrate`

Start the development server:

`pnpm dev`

Build the application:

`pnpm build`

Start the application:

`pnpm start`

## Linting

Lint the code:

`pnpm lint`

Typecheck the code:

`pnpm typecheck`

## Tests

Run the unit tests:

`pnpm run test`

Run the end-to-end tests:

`pnpm test:e2e`

## Docker

Create an image:

`pnpm docker:build`

Start a container:

`pnpm docker:start`

## Database

Query the database:

```shell
pgcli -h localhost -p 5432 -u postgres -d gamehoop
```
