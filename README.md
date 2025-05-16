# create-addons
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). `create-addons` is an online index of the [Create](https://modrinth.com/mod/create) [Minecraft](https://minecraft.net) mod addons. TailwindCSS, FlyonUI, and the Modrinth API are used in this project.

### How to run
Requires **Node.JS** or **Bun**
```sh
# clone tge repository
git clone https://github.com/Stef-00012/create-addons
# install the dependencies
npm i # or bun i
# setup the db
npm run db:setup # or bun db:setup
#rename .env.example to .env and set it up
mv .env.example .env # make sure to set ENVIRONMENT to production
# start
npm run dev # or bun dev
```

### Maintainers
This project is maintained by [Stef](https://github.com/Stef-00012) and [orangc](https://orangc.net). Stef did the backend and orangc did the frontend/UI design.

### License
This project is licensed under the [GNU GPL v3](./LICENSE) license. This project is not affiliated with or endorsed by Create or Mojang.