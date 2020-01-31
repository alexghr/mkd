FROM node:alpine as build

ENV NODE_ENV production
WORKDIR /mkd

COPY ./package.json yarn.lock lerna.json ./

# Install deps first
# We do this first in order for Docker to cache and reuse this step if package.json/yarn.lock don't change
RUN yarn install --frozen-lockfile --production=false

# Copy the code
COPY . ./

# Run `yarn install` again in order to link the workspaces together
RUN yarn install --frozen-lockfile --production=false && yarn workspace @mkd/web build

# Build the production image
FROM nginx:alpine as final

WORKDIR /srv

COPY --from=build /mkd/packages/web/build ./
COPY ./packages/web/public/config.json ./
COPY ./packages/web/nginx.conf /etc/nginx

