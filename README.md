# Sims 2 Web Tools

Tools for manipulating Sims 2 mod files on the web :computer:

## Tools in this repo
- simpai: a web interface for manipulating .package files
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

## Conventional commits

This repo enforces conventional commits to automate versioning and per-package changelog generation. This means commit messages must adhere to the following pattern:
```
type(scope): subject

optional body
```

where `type` is one of
- `feat`
- `fix`
- `docs`
- `style`
- `refactor`
- `test`
- `revert`

`scope` is the name of a package in `/packages`, and `subject` is a normal commit message. If more context is needed, you can add a body after a newline. Example:
```
feat(dbpf-transform): add strange smells

they're pretty stinky
```

For breaking changes, add a `!` after the scope:
```
feat(simpai)!: delete everything
```

For changes to the repo root, just omit the scope:
```
docs: add docs for conventional commits
```

## Deploying simpai / publishing packages to npm

Upon merging new code into `main`, [release-please](https://github.com/google-github-actions/release-please-action) will create a pull request (PR) for each package that
has unreleased changes. Merging that PR will release those changes, which includes
- deploying simpai if that is what was released, else publishing the released package to npm
- creating a github release
- updating the released package's `CHANGELOG.md` file to reflect any newly released changes
- bumping the released package's version in `package.json` according to the type of changes that were in the release

For versioning, `fix` indicates a [SemVer](https://semver.org/) patch bump, `feat` indicates a SemVer minor bump (or patch if < 1.0.0), and a trailing `!` indicates
a SemVer major bump (or minor if < 1.0.0). All other types are not considered user-facing and do not indicate a bump of any kind.

## Adding a new package

- add new directory to `packages/`
- add a `package.json`
- add the package path to `release-please-config.json` ([see config options](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md#configfile))
- add the package path and initial version to `.release-please-manifest.json`
