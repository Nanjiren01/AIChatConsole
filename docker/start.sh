#!/bin/bash

sed -i "s/BASE_URL/$BASE_URL/g" /etc/nginx/nginx.conf

echo 'starting to run nginx...'
nginx -g 'daemon off;'
