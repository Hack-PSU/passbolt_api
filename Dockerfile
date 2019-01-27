FROM passbolt/passbolt:latest
COPY pkey.asc /var/www/passbolt/config/gpg
COPY pubkey.asc /var/www/passbolt/config/gpg
COPY config/passbolt.php config/passbolt.php
COPY certs/cert.pem /etc/ssl/certs/certificate.crt
COPY certs/privkey.pem /etc/ssl/certs/certificate.key
COPY nginx_default.conf /etc/nginx/conf.d/default.conf
RUN chown -R www-data:www-data /var/www && \
    su -s /bin/bash -c "gpg --home /home/www-data/.gnupg --import /var/www/passbolt/config/gpg/pkey.asc" www-data && \
    su -s /bin/bash -c "gpg --home /home/www-data/.gnupg --import /var/www/passbolt/config/gpg/pubkey.asc" www-data && \
    echo 'trusted-key AA89DC4105515504' > /home/www-data/.gnupg/gpg.conf && \
    echo "deb http://ftp.debian.org/debian stretch-backports main" | tee -a /etc/apt/sources.list && \
    apt-get update && apt-get install -y certbot python-certbot-nginx -t stretch-backports
COPY startup.sh startup.sh
CMD chmod +x ./startup.sh && ./startup.sh
