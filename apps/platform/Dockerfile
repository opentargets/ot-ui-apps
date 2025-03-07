FROM alpine

# install nginx and brotli module
RUN apk update
RUN apk add --upgrade nginx brotli nginx-mod-http-brotli

# copy assets and config
COPY ./bundle-platform /usr/share/nginx/html
COPY ./etc/platform.conf /etc/nginx/http.d/platform.conf

# run nginx
CMD ["nginx", "-g", "daemon off;"]
