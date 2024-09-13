FROM python:3.9.18-alpine3.18

RUN apk add build-base
RUN apk add postgresql-dev gcc python3-dev musl-dev

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY
# ARG S3_BUCKET
# ARG S3_KEY
# ARG S3_SECRET

WORKDIR /var/www

COPY requirements.txt .

RUN python -m venv venv
RUN . venv/bin/activate && pip install -r requirements.txt
RUN . venv/bin/activate && pip install psycopg2
RUN . venv/bin/activate && pip install email-validator
RUN . venv/bin/activate && pip install requests

COPY . .

RUN . venv/bin/activate && flask db upgrade
RUN . venv/bin/activate && flask seed all
CMD . venv/bin/activate && gunicorn app:app