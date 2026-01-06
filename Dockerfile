# Use Node.js LTS version
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema and generate client
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build TypeScript
RUN npm install typescript ts-node @types/node --save-dev && \
    npm run build && \
    npm prune --production

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
