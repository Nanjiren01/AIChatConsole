
# docker build -t nanjiren01/aichat-console:0.0.1 .
# docker push nanjiren01/aichat-console:0.0.1

FROM nginx


RUN mkdir -p /app/

COPY dist /usr/share/nginx/html/

COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80


