FROM alpine

# install nginx and brotli module
RUN apk update
RUN apk add --upgrade nginx brotli nginx-mod-http-brotli

# copy assets, config and entrypoint
COPY ./bundle-platform /usr/share/nginx/html
COPY ./etc/platform.conf /etc/nginx/http.d/platform.conf
COPY ./etc/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# run nginx
ENTRYPOINT [ "/entrypoint.sh" ]
