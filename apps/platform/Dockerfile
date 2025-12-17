FROM alpine

# install nginx and brotli module
RUN apk update
RUN apk add --upgrade nginx brotli nginx-mod-http-brotli

RUN addgroup -g 1001 -S nginxgroup && \
    adduser -u 1001 -D -S -G nginxgroup nginxuser
    
# copy assets, config and entrypoint
COPY ./bundle-platform /usr/share/nginx/html
COPY ./etc/platform.conf /etc/nginx/http.d/platform.conf
COPY ./etc/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# create necessary nginx folders and set permissions
RUN mkdir -p /var/run/nginx /var/log/nginx /etc/nginx /usr/share/nginx/html 
RUN chown -R nginxuser:nginxgroup /run /var/run/nginx /var/log/nginx /var/lib/nginx /etc/nginx /usr/share/nginx/html

# adjust nginx config to use correct pid file location and remove user directive
RUN sed -i 's/\/var\/run\/nginx.pid/\/var\/run\/nginx\/nginx.pid/g' /etc/nginx/nginx.conf
RUN sed -i '/^user/d' /etc/nginx/nginx.conf

USER nginxuser

# run nginx
ENTRYPOINT [ "/entrypoint.sh" ]
