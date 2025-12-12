
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN rm -rf node_modules && npm install
RUN npm run build --prod
FROM nginx:alpine
COPY --from=build /app/dist/semana3-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 8088
CMD ["nginx", "-g", "daemon off;"]