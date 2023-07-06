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

# docker build -t harbor.nanjiren.online:8099/aichat/aichat-console:0.3 .
# docker push harbor.nanjiren.online:8099/aichat/aichat-console:0.3
# docker tag harbor.nanjiren.online:8099/aichat/aichat-console:0.3 harbor.nanjiren.online:8099/aichat/aichat-console:latest
# docker push harbor.nanjiren.online:8099/aichat/aichat-console:latest

# docker build -t harbor.nanjiren.online:8099/aichat/aichat-console:0.3.1 .
# docker push harbor.nanjiren.online:8099/aichat/aichat-console:0.3.1
# docker tag harbor.nanjiren.online:8099/aichat/aichat-console:0.3.1 harbor.nanjiren.online:8099/aichat/aichat-console:latest
# docker push harbor.nanjiren.online:8099/aichat/aichat-console:latest

# docker build -t harbor.nanjiren.online:8099/aichat/aichat-console:0.3.2 .
# docker push harbor.nanjiren.online:8099/aichat/aichat-console:0.3.2
# docker tag harbor.nanjiren.online:8099/aichat/aichat-console:0.3.2 harbor.nanjiren.online:8099/aichat/aichat-console:latest
# docker push harbor.nanjiren.online:8099/aichat/aichat-console:latest

# docker build -t nanjiren01/aichat-console:0.4 .
# docker push nanjiren01/aichat-console:0.4
# docker tag nanjiren01/aichat-console:0.4 nanjiren01/aichat-console:latest
# docker push nanjiren01/aichat-console:latest


# docker build -t harbor.nanjiren.online:8099/aichat/aichat-console:0.5 .
# docker push harbor.nanjiren.online:8099/aichat/aichat-console:0.5
# docker tag harbor.nanjiren.online:8099/aichat/aichat-console:0.5 harbor.nanjiren.online:8099/aichat/aichat-console:latest
# docker push harbor.nanjiren.online:8099/aichat/aichat-console:latest


FROM nginx


RUN mkdir -p /app/

COPY dist /usr/share/nginx/html/

ENV BASE_URL=aichat-admin:8080

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh ~/start.sh

EXPOSE 80

CMD ["bash", "~/start.sh"]



