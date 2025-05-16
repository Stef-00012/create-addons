# create-addons
`create-addons` is an online index of the [Create](https://modrinth.com/mod/create) [Minecraft](https://minecraft.net) mod addons. TailwindCSS, FlyonUI, and the Modrinth API are used in this project.

### Configuration
> [!IMPORTANT]
> Requires [Node.JS](https://nodejs.org/en/download) or [Bun](https://bun.sh/).

```sh
# Clone the repository
git clone https://github.com/Stef-00012/create-addons

# Install the dependencies
npm i # or bun i

# Setup the database
npm run db:setup # or bun db:setup

# Rename env file and configure
mv .env.example .env # make sure to set ENVIRONMENT to "production"
```

#### Development mode
```sh
# Start the app
npm run dev # or bun dev
# Then wait for it to finish fetching the mods
```

#### Production Mode
```sh
# Build the app
npm run build # or bun run build

# Start the app
npm run start # or bun start
# Then wait for it to finish fetching the mods
```

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