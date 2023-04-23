# ---- Build Stage ----
FROM node:14 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Install dependencies
RUN npm ci

# Copy the source code
COPY . .

# Create a production build
RUN npm run build

# ---- Production Stage ----
FROM nginx:1.21

# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
