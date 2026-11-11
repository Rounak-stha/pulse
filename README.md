# Pulse

Multi-tenant commerce built on top of Vendure, designed for scalable storefronts, marketplaces, and B2B commerce experiences.

<p align="center">
  <img src="https://img.shields.io/badge/Node-%3E%3D18-4c9a2a" alt="Node.js 18+" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6" alt="TypeScript 5.8" />
  <img src="https://img.shields.io/badge/Monorepo-Lerna-7C3AED" alt="Lerna monorepo" />
  <img src="https://img.shields.io/badge/Stack-Vendure%20%2B%20GraphQL-0A0A0A" alt="Vendure + GraphQL" />
</p>

## Overview

Pulse is a commerce platform built with the Vendure ecosystem and tailored for multi-tenant operations. It combines a headless commerce engine, admin tooling, storefront patterns, and plugin-based extensibility to support online retailers and complex commerce workflows.

### Highlights

- Multi-tenant commerce architecture
- Vendure-based backend and GraphQL APIs
- TypeScript-first monorepo structure
- React-based admin/dashboard tooling
- Storefront block system with runtime and builder packages
- Extensible plugins for payments, emails, search, and assets
- MySQL, PostgreSQL, MariaDB, and SQLite support via TypeORM

## Architecture

This repository is organized as a Lerna monorepo under `packages/`.

- `packages/core` — core commerce framework and platform logic
- `packages/common` — shared types and utilities
- `packages/dashboard` — administration UI and builder tooling
- `packages/storefront` — runtime storefront rendering
- `packages/storefront-blocks` — reusable storefront block components
- `packages/dev-server` — local development server
- `packages/testing` — testing and e2e helpers

Additional platform capabilities are delivered through plugin packages such as:

- `payments-plugin`
- `email-plugin`
- `elasticsearch-plugin`
- `asset-server-plugin`

The project uses TypeORM and exposes both Admin API and Shop API layers through GraphQL.

## Getting started

### Requirements

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Build the project

```bash
npm run build
```

### Run tests

```bash
npm run test
```

For a single package:

```bash
cd packages/<name>
npm run test
```

### Run e2e tests

```bash
npm run e2e
```

### Start the dev server

```bash
cd packages/dev-server
npm run dev
```

### Regenerate GraphQL types

```bash
npm run codegen
```

## Repository structure

```text
.
├── docs/
├── documentation/
├── packages/
├── scripts/
├── AGENTS.md
├── CHANGELOG.md
├── CHANGELOG_NEXT.md
├── CONTRIBUTING.md
├── Dockerfile
├── docker-compose.yml
├── LICENSE.md
├── README.md
├── package.json
├── tsconfig.json
└── ...
```

## Documentation

- `documentation/builder/builder-architecture.md` — builder architecture and rendering model
- `docs/` — Docusaurus-based documentation site
- `packages/` — source code for the commerce platform

## Development notes

The repository follows a strict TypeScript setup with ESLint and Prettier. The codebase uses conventional commits and prefers predictable import ordering and clear package boundaries.

For builder work and storefront/dashboard integration changes, follow the architecture guidance in `documentation/builder/builder-architecture.md` before modifying those packages.

## Contributing

Contributions are welcome. Please follow the repository conventions and validate changes with the relevant tests before submitting a PR.
