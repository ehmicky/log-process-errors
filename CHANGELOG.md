# 5.0.3

## Bug fixes

- Do not make tests fail on `multipleResolves` events with the `testing` option

# 5.0.2

## Bug fixes

- Do not handle deprecation warnings on unhandled rejection promises anymore
  since this is due to a bug in Node `12.6.0` which has been fixed in `12.7.0`.

# 5.0.1

## Bug fixes

- Do not print deprecation warnings on unhandled rejection promises with Node
  `12.6.0`

## Dependencies

- Upgrade `supports-color`

# 5.0.0

Thanks to @Hongarc and @stevenvachon for their first-time contributions!

## Breaking changes

- Minimum Node.js version is now `8.12.0` (instead of `8.10.0`)

## Documentation

- Improve documentation and examples

## Internal

- Upgrade development dependencies
- Code refactoring
- Improve linting

# 4.1.1

## Dependencies

- Upgrade `figures`
- Upgrade `moize`

## Internal

- Upgrade development dependencies
- Code refactoring

# 4.1.0

## Internal

- Use ES modules

# 4.0.0

## Breaking changes

- Rename `log-process-errors/register` to `log-process-errors/build/register`
