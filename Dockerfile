FROM python:3.9.18-alpine3.18

# Install necessary packages
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev nodejs npm

# Set environment variables
ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

# Set working directory
WORKDIR /var/www

# Copy requirements.txt and install dependencies
COPY requirements.txt .

# Create and activate virtual environment, then install dependencies
RUN python -m venv venv
RUN . venv/bin/activate && pip install --upgrade pip
RUN . venv/bin/activate && pip install -r requirements.txt
RUN . venv/bin/activate && pip check

# Copy the rest of the application code
COPY . .

# Install chart.js and chartjs-plugin-annotation using npm
RUN npm install chart.js chartjs-plugin-annotation

# Run database migrations and seed data
RUN . venv/bin/activate && flask db upgrade
RUN . venv/bin/activate && flask seed all

# Set the command to run the application
CMD . venv/bin/activate && gunicorn app:app
