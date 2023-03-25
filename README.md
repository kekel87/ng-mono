# 🅰️ ng-mono

> NX Mono repo containing my Angular projects

```
📦ng-monno
 ┣ 📂apps
 ┃ ┣ 📂 netatmo
 ┃ ┣ 📂 collection
 ┃ ┗ 📂...
 ┗ 📂libs
   ┗ 📂...
```

## [Netatmo](/apps/netatmo/README.md)

An application using the Netatmo API to display all measures in one place

## Collection (Soon ...)

Application for tracking collections (games, books, manga, amiibo & vinyl).

> Yes, it is very specific 🤓

<details>
  <summary>
    <h2>Toolings</h2>
  </summary>

**Base NX Commands**

```bash
nx [CMD] # Global install  npm install -g nx
npx nx [CMD]
npm run nx [CMD]
npm run ng [CMD]
```

**Runnning**

```bash
nx serve # netatmo default
nx serve [app-name]
```

**Code formating**

```bash
# nx config format
nx format

# apps format
nx lint [app-lib-name]
nx affected:lint --fix
nx run-many --target=lint --fix
```

**Code linting**

```bash
# nx config check
nx format:check

# apps lint
nx lint [app-lib-name]
nx affected:lint
nx run-many --target=lint
```

**Unit testing**

```bash
nx test [app-lib-name]
nx affected:test
nx run-many --target=test
```

**End to end testing**

```bash
nx e2e [app-name-e2e]

nx affected:e2e
nx run-many --target=e2e
```

**NX command**

```bash
nx graph
nx affected:graph 😍
nx print-affected --type=app --select=projects
nx workspace-lint
```

**Generators/Schematics**

```
nx list
nx g @nrwl/angular:component [name] --standalone
```

</details>

---

<details>
  <summary>
    <h2>NX Autogenerated DOC</h2>
  </summary>

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Development server

Run `nx serve netatmo` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

</details>
