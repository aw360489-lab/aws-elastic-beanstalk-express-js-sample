FROM node:16-alpine

WORKDIR /app

# Copy dependency manifests first for better layer caching.
COPY package*.json ./

# Install only production dependencies in the final image.
RUN npm ci --omit=dev

# Copy application source code.
COPY . .

EXPOSE 8080

# Run the application as the non-root Node user.
USER node

CMD ["npm", "start"]
