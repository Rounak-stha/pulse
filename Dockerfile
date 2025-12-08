# -------------------------------
# Stage 1: Build stage
# -------------------------------
FROM node:22.15.0-alpine AS build

WORKDIR /app

# -------------------------------
# Copy root package files
# -------------------------------
COPY package*.json lerna.json ./

# -------------------------------
# Copy package.json of workspaces
# -------------------------------
COPY packages/common/package.json packages/common/
COPY packages/core/package.json packages/core/
COPY packages/asset-server-plugin/package.json packages/asset-server-plugin/
COPY packages/dashboard/package.json packages/dashboard/
COPY packages/prod-server/package.json packages/prod-server/

# -------------------------------
# Install rimraf globally for build
# -------------------------------
RUN npm install -g rimraf

# -------------------------------
# Install deps for workspaces
# -------------------------------
RUN npm install --workspace=packages/common
RUN npm install --workspace=packages/dashboard
RUN npm install --workspace=packages/core
RUN npm install --workspace=packages/asset-server-plugin
RUN npm install --workspace=packages/prod-server

# -------------------------------
# Copy full source code
# -------------------------------
COPY . .

# -------------------------------
# Build packages in correct order
# -------------------------------
RUN cd packages/dashboard && npm run build              # Build dashboard plugins
RUN cd packages/common && npm run build                 # Build common package
RUN cd packages/core && npm run build                   # Build core
RUN cd packages/asset-server-plugin && npm run build    # Build asset-server-plugin
RUN cd packages/dashboard && npm run build:standalone   # Build standalone dashboard
RUN cd packages/prod-server && npm run build            # Build prod-server

# -------------------------------
# Stage 2: Production image
# -------------------------------
FROM node:22.15.0-alpine

WORKDIR /app

# -------------------------------
# Copy root package files
# -------------------------------
COPY package*.json lerna.json ./

# -------------------------------
# Copy package.json of workspaces
# -------------------------------
COPY packages/common/package.json packages/common/
COPY packages/core/package.json packages/core/
COPY packages/asset-server-plugin/package.json packages/asset-server-plugin/
COPY packages/dashboard/package.json packages/dashboard/
COPY packages/prod-server/package.json packages/prod-server/

# -------------------------------
# Install production deps for workspaces
# -------------------------------
RUN npm install --workspace=packages/common --omit=dev
RUN npm install --workspace=packages/dashboard --omit=dev
RUN npm install --workspace=packages/core --omit=dev
RUN npm install --workspace=packages/asset-server-plugin --omit=dev
RUN npm install --workspace=packages/prod-server --omit=dev

# -------------------------------
# Copy built dist files from build stage
# -------------------------------
COPY --from=build /app/packages/common/lib ./packages/common/lib
COPY --from=build /app/packages/core/cli ./packages/core/cli
COPY --from=build /app/packages/core/dist ./packages/core/dist
COPY --from=build /app/packages/asset-server-plugin/lib ./packages/asset-server-plugin/lib
COPY --from=build /app/packages/dashboard/build ./packages/dashboard/build
COPY --from=build /app/packages/dashboard/dist ./packages/dashboard/dist
COPY --from=build /app/packages/prod-server/dist ./packages/prod-server/dist

# -------------------------------
# Set working directory for prod-server
# -------------------------------
WORKDIR /app/packages/prod-server

# -------------------------------
# Container entrypoint
# -------------------------------
CMD ["node", "dist/index.js"]
