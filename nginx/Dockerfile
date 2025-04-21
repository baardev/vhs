# Use the lightweight official image
FROM nginx:alpine

# Optional build‑time flag (has no effect on NGINX itself,
# but you asked for it in docker‑compose.yml)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Remove the default config shipped with the base image
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom configs and SSL material
COPY conf.d/          /etc/nginx/conf.d/
COPY ssl/             /etc/nginx/ssl/
COPY certbot/conf/    /etc/letsencrypt/
COPY certbot/www/     /var/www/certbot/

# Expose the ports NGINX listens on (informational –
# docker‑compose "ports:" still controls host binding)
EXPOSE 80 443

# Nothing else to do – the base image's CMD
# ("nginx -g 'daemon off;'") stays in place
