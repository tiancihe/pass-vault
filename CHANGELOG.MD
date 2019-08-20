## 0.2.0

- New commands: `backup` / `restore` / `export`
- Login secret length restriction down to 4 (simply repeat)
- Added unit tests

## 0.3.0

- New commands: `clip` / `list`
- Added flag shortcuts `-l` and `-t`

## 0.3.1

- Command `gen` now copys generated password to clipboard by default
- Docs and chores

## 0.4.0

- New command: `ui`
- Added GUI and server -- based on react, antd and express
- Migrate from rollup to parcel
- Using concurrently to speeds up development

## 0.4.1

- Adds shebang -- v0.4.0 does not work due to lack of node shebang
- Resolves version from package.json directly