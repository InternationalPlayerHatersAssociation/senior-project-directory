# ---- Build Stage ----
FROM python:3.9-slim AS build

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends build-essential gcc

# Copy requirements.txt and install dependencies
RUN apt-get update && \
    apt-get install -y postgresql-server-dev-all && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


# ---- Production Stage ----
FROM python:3.9-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy the installed dependencies from the build stage
COPY --from=build /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Copy the application code
COPY . .


# Expose the port the app runs on
EXPOSE 8000

# Start gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
