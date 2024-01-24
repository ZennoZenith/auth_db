FROM oven/bun:latest as base
# FROM oven/bun:alpine
# FROM oven/bun:slim
WORKDIR /usr/src/app
RUN mkdir -p /log

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile


# # install with --production (exclude devDependencies)
# RUN mkdir -p /temp/prod
# COPY package.json bun.lockb /temp/prod/
# RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=5000
ENV ORIGIN=*
ENV USER_DATABASE_URL=""

# RUN bun install
USER bun
EXPOSE 5000/tcp

ENTRYPOINT [ "bun", "run", "src/server.ts" ]

