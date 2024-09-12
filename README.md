# postgres-to-docs
[![Build Status][ci-image]][ci-url]
[![License][license-image]][license-url]

Make your database documentation smoooth by generating markdown for your schema.

## Usage

1.  Install through npm
    ```bash
    npm install @hankanman/postgres-to-docs
    ```

2. Define a `postgrestodocs.json` config file
    ```json
    {
        "host": "localhost",
        "port": 5432,
        "user": "user",
        "password": "password",
        "database": "database",
        "schema": "public",
        "output": "docs/schema.md",
        "includeTables": [],
        "exludeTables": [],
        "includeTypes": false,
        "pureMarkdown": false,
        "includeRLS": false,
        "includeToc": false
    }
    ```
3. Run the tool
    ```bash
    postgres-to-docs
    ```

## Problem
You need to get a quick and easy overview of your database schema but don't want to...
* Open the source code and find the model definitions
* Start your database and service, install dependencies, have a proper configuration, and open an external tool like TablePlus or DBeaver
* Read through your migrations directory to find the latest version of your schema
* Look through external documentation that might be out of date


## Introducing postgres-to-docs!
A Node CLI that renders your schemas as markdown and keeps it up to date! Generates documentation for
- [X] Tables - PKs, FKs, Nullable and Default values
- [X] Views
- [X] User defined types like composites and enums

## Future work
- [ ] Additional export formats like entity relationship-diagrams
- [ ] Materialized views
- [ ] Support for watch-mode to rerun the tool on file change


## Development
Clone the repo, then:

```bash
npm install
npm run start:dev
```

## How to contribute

See our guide on [contributing](.github/CONTRIBUTING.md).

## Release History

See our [changelog](CHANGELOG.md).

## License

Copyright © 2021 Klarna Bank AB

For license details, see the [LICENSE](LICENSE) file in the root of this project.
