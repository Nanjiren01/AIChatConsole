

FROM nginx


RUN mkdir -p /app/

COPY dist /usr/share/nginx/html/

COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80


