# 注意，请先运行npm run build:prod生成dist文件

# docker build -t nanjiren01/aichat-console:0.0.1 .
# docker push nanjiren01/aichat-console:0.0.1

# docker build -t nanjiren01/aichat-console:0.1 .
# docker push nanjiren01/aichat-console:0.1
# docker tag nanjiren01/aichat-console:0.1 nanjiren01/aichat-console:latest
# docker push nanjiren01/aichat-console:latest

# docker build -t nanjiren01/aichat-console:0.2 .
# docker push nanjiren01/aichat-console:0.2
# docker tag nanjiren01/aichat-console:0.2 nanjiren01/aichat-console:latest
# docker push nanjiren01/aichat-console:latest

# docker build -t nanjiren01/aichat-console:0.2.1 .
# docker push nanjiren01/aichat-console:0.2.1
# docker tag nanjiren01/aichat-console:0.2.1 nanjiren01/aichat-console:latest
# docker push nanjiren01/aichat-console:latest


# docker build -t nanjiren01/aichat-console:0.2.3 .
# docker push nanjiren01/aichat-console:0.2.3
# docker tag nanjiren01/aichat-console:0.2.3 nanjiren01/aichat-console:latest
# docker push nanjiren01/aichat-console:latest

# docker build -t nanjiren01/aichat-console:0.4 .
# docker push nanjiren01/aichat-console:0.4
# docker tag nanjiren01/aichat-console:0.4 nanjiren01/aichat-console:latest
# docker push nanjiren01/aichat-console:latest

FROM nginx


RUN mkdir -p /app/

COPY dist /usr/share/nginx/html/

COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80


