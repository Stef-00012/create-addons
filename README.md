# create-addons
`create-addons` is an online index of the [Create](https://modrinth.com/mod/create) [Minecraft](https://minecraft.net) mod addons. TailwindCSS, FlyonUI, the Modrinth API and th Curseforge API are used in this project.

### How to Run
> [!IMPORTANT]
> [Bun](https://bun.sh/).

```sh
# Clone the repository
git clone https://github.com/Stef-00012/create-addons

# Install the dependencies
bun i

# Setup the database
bun db:setup

# Rename env file and configure
mv .env.example .env # make sure to set ENVIRONMENT to "production"
```

#### Development mode
```sh
# Start the app
bun dev
# This won't fetch the mods, you first have to run in production mode in order to fetch the mods
```

#### Production Mode
```sh
# Build the app
bun run build

# Start the app
bun start
# Then wait for it to finish fetching the mods
```

### Maintainers
This project is maintained by [Stef](https://github.com/Stef-00012) and [orangc](https://orangc.net). Stef did the backend and orangc did the frontend/UI design.

### License
This project is licensed under the [GNU GPL v3](./LICENSE) license. This project is not affiliated with or endorsed by Create or Mojang.

# TO-DO
- [ ] /docs/models page
- [ ] Websocket page(s)