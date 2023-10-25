# 注意，请先运行npm run build:prod生成dist文件

# docker build -t nanjiren01/aichat-console:0.9.5 ../AIChatConsole
# docker push nanjiren01/aichat-console:0.9.5
# docker tag nanjiren01/aichat-console:0.9.5 nanjiren01/aichat-console:pro-latest
# docker push nanjiren01/aichat-console:pro-latest


FROM nginx


RUN mkdir -p /app/

COPY dist /usr/share/nginx/html/

ENV BASE_URL=aichat-admin:8080

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh ~/start.sh

EXPOSE 80

CMD ["bash", "~/start.sh"]



