# 注意，请先运行npm run build:prod生成dist文件

# docker build -t nanjiren01/aichat-console:0.8 .
# docker push nanjiren01/aichat-console:0.8
# docker tag nanjiren01/aichat-console:0.8 nanjiren01/aichat-console:latest
# docker push nanjiren01/aichat-console:latest

FROM nginx


RUN mkdir -p /app/

COPY dist /usr/share/nginx/html/

COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80


