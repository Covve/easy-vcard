## `2.0.0`

- **Breaking**: RFC6350 §3.4 value escaping is now correct. Commas (`,`) and semicolons (`;`) inside property text values are now escaped to `\,` and `\;` (previously emitted unescaped). Output for any vcard with `,` or `;` in a value will differ.
- **Breaking**: Lines longer than 75 octets are now folded with `CRLF + SPACE` per RFC6350 §3.2. Codepoint-safe (multibyte UTF-8 characters are not split).
- **Breaking**: Minimum Node version is now `>=18`. `lodash.clonedeep` and `lodash.isempty` runtime dependencies removed in favor of native `structuredClone` and inline checks.
- Dependency refresh: TypeScript 5.7, Jest 30, ESLint 9 (flat config), `@typescript-eslint` 8, `@types/node` 22. Removed unused `tslint` and deprecated `eslint-config-standard-with-typescript`.
- CI bumped from Node 16 to Node 20 LTS.
- Test coverage expanded for escape rules, line folding, multibyte UTF-8, version flag, empty-vcard error, deep-clone isolation, and parameter propagation on `setRevision` / `setUID`.

## `1.1.1`

- Add encoding to list of params to support PHOTO V3 and more

## `1.1.0`

- Add nickname

## `0.1.0` 2020-03-05

- Add url field to vcard and formatter
- Version bump

## `0.0.5` 2019-01-19

- `Fixed` gitignore preventing js files from being published

## `0.0.4` 2019-01-19

- `Added` photo field
