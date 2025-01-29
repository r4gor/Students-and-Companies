FROM postgres:latest

RUN apt-get update && apt-get install -y cron

COPY update_status.sh /update_status.sh
COPY cronjob /etc/cron.d/cronjob

RUN chmod +x /update_status.sh && chmod 0644 /etc/cron.d/cronjob

RUN crontab /etc/cron.d/cronjob

CMD service cron start && docker-entrypoint.sh postgres
