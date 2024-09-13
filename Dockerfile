FROM python:3.9.18-alpine3.18

RUN apk add build-base
RUN apk add postgresql-dev gcc python3-dev musl-dev
RUN apk add --update nodejs npm

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

RUN pip install -r requirements.txt
RUN pip install psycopg2
RUN pip install email-validator
RUN pip install requests
RUN pip check

COPY . .

RUN npm install chart.js chartjs-plugin-annotation

RUN flask db upgrade
RUN flask seed all
CMD gunicorn app:app
