FROM node:14.15.0 as build

# install dependencies
WORKDIR /app

# Use PNPM
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod
ADD . ./
RUN pnpm install -r

# Copy all local files into the image.
COPY . .
RUN npm run build

###
# Only copy over the Node pieces we need
# ~> Saves 35MB
###
FROM node:14.15.0

WORKDIR /app
COPY --from=build /app/package.json /app/build /app/

EXPOSE 3000
CMD ["node", "./index.js"]
