#!/bin/bash

set -m

/docker-entrypoint.sh &

sleep 60
certbot -n --nginx -d passbolt.hackpsu.org -w /var/www/passbolt/webroot --agree-tos -m hackpsudev@gmail.com certonly && \
if [ $? -ne 0 ]
then
    exit 1
fi
ln -sf /etc/letsencrypt/live/passbolt.hackpsu.org/cert.pem /etc/ssl/certs/certificate.crt
ln -sf /etc/letsencrypt/live/passbolt.hackpsu.org/privkey.pem /etc/ssl/certs/certificate.key
fg %1
