FROM nginx
WORKDIR /var/www/demo
COPY ./dist ./
COPY ./default.conf /etc/nginx/conf.d/default.conf
# CMD [ "nginx" ]