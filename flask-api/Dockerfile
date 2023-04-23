# ---- Build Stage ----
FROM python:3.9-slim-buster AS build

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        postgresql-client
# Copy requirements.txt and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Install gunicorn explicitly
RUN pip install --no-cache-dir gunicorn

# ---- Production Stage ----
FROM python:3.9-slim-buster AS app

# Set the working directory
WORKDIR /usr/src/app

ENV FLASK_APP=app.py
ENV SECRET_KEY=1d387a4ec8206070645d8c87
ENV DB_HOST=course-model.cfdbd87ngqcd.us-east-1.rds.amazonaws.com
ENV DB_PORT=5432
ENV DB_NAME=course-model
ENV DB_USER=postgres
ENV DB_PASSWORD=N00k!e99123
# Install the required library
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq5 \
        netcat

# Copy the installed dependencies from the build stage
COPY --from=build /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Copy the gunicorn executable from the build stage
COPY --from=build /usr/local/bin/gunicorn /usr/local/bin/gunicorn

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start gunicorn
CMD ["gunicorn", "app:app", "-w", "4", "-b", "0.0.0.0:8000"]




