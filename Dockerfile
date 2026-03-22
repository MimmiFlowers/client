# build stage
FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_API_URL
ARG VITE_STRIPE_PUBLIC_KEY

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# serve stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
