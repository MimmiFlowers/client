# build stage
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_URL
ARG VITE_STRIPE_PUBLIC_KEY

COPY package*.json ./
RUN npm ci

COPY . .
# vite build only, not `npm run build` (= tsc -b && vite build): the type check runs in CI,
# and the deploy waits for CI. On the t3.micro tsc -b alone took ~6 minutes.
RUN npx vite build

# serve stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
