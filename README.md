# Sims 2 Web Tools

Tools for manipulating Sims 2 mod files on the web :computer:

## Tools in this repo
- SimPAI: a web interface for manipulating .package files
- dbpf-transform: a library for serializing and deserializing .package files

## Local development

First-time setup:
- install the node version listed in [.nvmrc](https://github.com/bass-dandy/simpai/blob/main/.nvmrc), either manually or via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) 
- [install `pnpm`](https://pnpm.io/installation)
- run `pnpm install`
- run `pnpm build`

Running the app:
- run `pnpm start` to run dev server with all packages in watch mode
- run `pnpm simpai preview` to preview prod build (after running `pnpm build`)

## Publishing packages to npm

Just create a new release with the title `<package-name> v<version>` and tag `package-name@version`! GitHub actions will take care of the rest.
