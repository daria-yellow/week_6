FROM node:latest as dependencies
WORKDIR /week_6
COPY package*.json ./
RUN npm install 

FROM node:latest as builder
WORKDIR /week_6
COPY . .
COPY --from=dependencies /week_6/node_modules ./node_modules
RUN npm run build

FROM node:latest as runner
WORKDIR /week_6
ENV NODE_ENV production

COPY --from=builder /week_6/public ./public
COPY --from=builder /week_6/.next ./.next
COPY --from=builder /week_6/node_modules ./node_modules
COPY --from=builder /week_6/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
