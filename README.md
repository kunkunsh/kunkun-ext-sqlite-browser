# Kunkun Extension Sqlite Browser

- NPM: https://www.npmjs.com/package/kunkun-ext-sqlite-browser
- Store: https://kunkun.sh/store/sqlite-browser

This extension is a simple SQLite browser that allows you to view unencrypted SQLite databases.

![demo](https://i.imgur.com/lTAKenC.png)

## Features

- [x] Browse tables
- [x] View table data
- [x] View table columns
- [ ] View Encrypted Database
- [ ] Edit table data
- [ ] Execute SQL Query

- Direct execution of SQL query will be supported.
- Editing table data (in table cell) may be supported when I got time.
  - If you are willing to contribute, please send a PR, it is simply frontend code.
- Encrypted DB may not be supported in the future, as this extension relies on [Deno's Sqlite Lib](https://jsr.io/@db/sqlite), which does not support encryption.
