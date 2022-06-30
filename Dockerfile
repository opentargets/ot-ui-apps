FROM node:16 as build
# make sure app variable is set and valid
ARG app=""
RUN : "${app:?Missing --build-arg app}"
RUN case "$app" in platform) true;; genetics) true;; *) echo "variable 'app' must be set to either 'platform' or 'genetics'"; false;; esac
# assert that a compatible yarn version is installed or fail
RUN case `yarn --version` in 1.22*) true;; *) false;; esac
# COPY package.json yarn.lock /tmp/$app-app/
WORKDIR /tmp/app/
COPY . ./
RUN yarn --network-timeout 100000
RUN yarn build:$app
RUN mv ./apps/$app/bundle-$app/ ./bundle/

FROM node:16
RUN npm install --location=global serve
COPY --from=build /tmp/app/bundle/ /var/www/app/
WORKDIR /var/www/app/
EXPOSE 80
CMD ["serve", "--no-clipboard", "--single", "-l", "tcp://0.0.0.0:80"]
