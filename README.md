# Postgres to Docs
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/hankanman/postgres-to-docs/repolint.yml)
![NPM Downloads](https://img.shields.io/npm/d18m/%40hankanman%2Fpostgres-to-docs)
![GitHub License](https://img.shields.io/github/license/hankanman/postgres-to-docs)
![NPM Version](https://img.shields.io/npm/v/%40hankanman%2Fpostgres-to-docs)

Make your database documentation smooth by generating markdown for your schema. You need to get a quick and easy overview of your database schema but don't want to...
* Open the source code and find the model definitions
* Start your database and service, install dependencies, have a proper configuration, and open an external tool like TablePlus or DBeaver
* Read through your migrations directory to find the latest version of your schema
* Look through external documentation that might be out of date

## Features
postgres-to-docs generates comprehensive documentation for your PostgreSQL database schema:

### Documentation Elements
- [x] Tables
  - Primary Keys
  - Foreign Keys
  - Nullable fields
  - Default values
  - Column comments
- [x] Views
  - Column definitions
  - View comments
- [x] User-defined Types
  - Composite types
  - Enums
- [x] Functions
  - Full signatures
  - Arguments and return types
  - Function definitions
  - Language and volatility
- [x] Row Level Security (RLS) Policies
  - Policy definitions
  - USING expressions
  - WITH CHECK expressions
  - Applicable roles
- [x] Entity Relationship Diagrams
  - Mermaid.js format
  - Visual representation of relationships
  - Table structure visualization

### Output Formats
- [x] Markdown
  - Clean, readable documentation
  - Table of Contents
  - Hyperlinked references
  - Optional pure markdown mode (no HTML)
- [x] LLM-optimized JSON
  - Structured schema information
  - Complete metadata
  - Optimized for AI consumption
  - Includes schema statistics

### Configuration Options
- **Output Control**
  - `folder`: Output directory (default: "docs")
  - `fileName`: Base name for output files (default: "schema")
  - `pureMarkdown`: Generate clean markdown without HTML
  - `llmFormat`: Generate additional LLM-friendly JSON format
- **Content Filtering**
  - `includeTables`: List of tables to include
  - `excludeTables`: List of tables to exclude
  - `includeTypes`: Include user-defined types
  - `includeRLS`: Include RLS policies
  - `includeFunctions`: Include function definitions
  - `includeDiagram`: Include ER diagram
  - `includeToc`: Include table of contents
- **Database Connection**
  - Support for connection string or individual parameters
  - Environment variable support through `.env` files

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
        "folder": "docs",
        "fileName": "schema",
        "includeTables": [],
        "exludeTables": [],
        "includeTypes": true,
        "pureMarkdown": false,
        "includeRLS": true,
        "includeToc": true,
        "includeFunctions": true,
        "includeDiagram": true,
        "llmFormat": false
    }
    ```
3. Run the tool
    ```bash
    postgres-to-docs
    ```

### Environment Variables
You can use environment variables to avoid storing sensitive database credentials in your configuration file. The tool supports both `.env` and `.env.local` files, with `.env.local` taking precedence.

Create a `.env` or `.env.local` file or add the following to your existing `.env` file:
```env
# Database connection string
DB_STRING=postgresql://user:password@localhost:5432/database
```

The tool will:
1. Look for `.env.local` first (good for local development overrides)
2. Then look for `.env` (good for team-shared defaults)
3. Use DB_STRING to override the connection parameters if found
4. Fall back to the explicit values in the config file if DB_STRING is not found

**Best Practice**: Add `.env.local` to your `.gitignore` file to keep sensitive credentials out of version control:
```gitignore
.env.local
```

### CLI Options
All configuration options can be overridden via CLI arguments:
```bash
postgres-to-docs --folder=my-docs --fileName=my-schema --llmFormat=true
```

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

Contributors:
- [@hankanman](https://github.com/hankanman)

For license details, see the [LICENSE](LICENSE) file in the root of this project.
