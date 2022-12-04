# theway-instalink

Quick app to link blog posts with Instagram posts. [How to use?](./docs/README.md)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Local setup

1. Create a `.env` file using `.env-local` as reference for a quick start. You will need also a local or remote MongoDB instance.
1. Start the mock blog using `docker-compose`. You can also run `yarn dc:up`.
1. Start the dev server using `yarn dev` or `yarn dev:https` if you need to do something that needs to be served over HTTPS (for example, the Instagram OAuth integration). Be aware that the local HTTPS proxy is quite slow and adds a 80-110% overhead to all requests, so better use it only if needed.
