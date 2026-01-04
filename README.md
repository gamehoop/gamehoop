# gamehoop

<p align="center" style="width: 100%">
  <img src="src/assets/logo.svg" height="100" />
</p>

The easy to use tools to build and scale your games.

## Quick Start

Prerequisites: Install [Node](https://nodejs.org), [pnpm](https://pnpm.io), and [Docker](https://www.docker.com).

Copy then populate the environment variables:

`cp .env .env.local`

Install the dependencies:

`pnpm install`

Start the database:

`docker compose up -d`

Apply database schema:

`pnpm db:migrate`

Start the development server:

`pnpm dev`

## Linting

Lint and typecheck the code:

`pnpm check`

## Tests

Run the unit tests:

`pnpm run test`

## Database

You can use `psql` or [pgcli](https://www.pgcli.com) to query the database:

```shell
pgcli -h localhost -p 5432 -u postgres -d gamehoop
```
