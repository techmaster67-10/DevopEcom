FROM nginx:stable-alpine
RUN apk upgrade --no-cache
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80