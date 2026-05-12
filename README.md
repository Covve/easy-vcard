# Easy-vcard

Create vCards and format them to strings to export as `.vcf` or `.vcard` files. Implementation of vCard 4.0 in TypeScript, per [RFC6350](https://tools.ietf.org/html/rfc6350). Many vCard properties are not yet supported — see the "Not yet supported" section at the bottom.

Supports value escaping (RFC6350 §3.4) and content-line folding at 75 octets (§3.2), and falls back to `VERSION:3.0` output on demand for older parsers.

## Installation

```
npm install --save @covve/easy-vcard
```

Requires Node.js **≥18** (uses the built-in `structuredClone`).

## Usage

```ts
import { VCard } from '@covve/easy-vcard';

const vcard = new VCard()
  .setFullName('Johnny D. Doe-Smith')
  .addFirstName('John')
  .addLastName('Doe')
  .addLastName('Smith')
  .addPrefixName('Dr.')
  .addNickname('Jonny')
  .addPhone('+1 1221112', { pref: '1', type: 'home' })
  .addEmail('jdoe@jdoecomp.co')
  .addTitle('Senior Engineer')
  .addOrganization('Jdoecomp co.', ['North Division']);

const formattedText = vcard.toString();
// BEGIN:VCARD
// VERSION:4.0
// FN:Johnny D. Doe-Smith
// N:Doe,Smith;John;;Dr.;
// NICKNAME:Jonny
// TEL;PREF=1;TYPE=home:+1 1221112
// EMAIL:jdoe@jdoecomp.co
// TITLE:Senior Engineer
// ORG:Jdoecomp co.;North Division
// END:VCARD
//
// (each line is terminated with CRLF, and lines longer than 75 octets
//  are folded with CRLF + SPACE)
```

You can also use the `Formatter` directly if you already have an `IVCard` plain object:

```ts
import { Formatter, VCard } from '@covve/easy-vcard';

const formatter = new Formatter();
const text = formatter.format(vcard.toJSON());
```

## Behavior worth knowing

- **Escaping (§3.4).** Backslash, comma, semicolon, and newline characters in property text values are automatically escaped to `\\`, `\,`, `\;`, and `\n` respectively. You pass raw values; the library handles escaping.
- **Line folding (§3.2).** Content lines longer than 75 UTF-8 octets are folded with `CRLF` + space. Multibyte characters (CJK, emoji, etc.) are never split mid-codepoint.
- **`forceV3` flag.** `vcard.toString(true)` or `formatter.format(vcard, true)` emits `VERSION:3.0`. The output still uses 4.0 conventions internally — this is a compatibility shim for parsers that reject the 4.0 version header. Use with care.

## VCard methods

_`IParams` refers to an object containing parameters used on certain vCard properties (`label`, `language`, `value`, `pref`, `altId`, `pid`, `type`, `mediatype`, `calscale`, `sortAs`, `geo`, `timezone`, `encoding`). Not every property supports every parameter — see the RFC for details._

### `setFullName(fullName: string): VCard`

Sets the `FN` (formatted name) property. This is mandatory in a valid vCard; if no `FN` is set, one is generated from the name components on the `N` property.

---

### `addFirstName(firstName: string): VCard`
### `addMiddleName(middleName: string): VCard`
### `addLastName(lastName: string): VCard`
### `addPrefixName(pre: string): VCard`
### `addSuffixName(suf: string): VCard`

Append a first name, middle name, last name, honorific prefix, or honorific suffix to the `N` property.

---

### `addNickname(nickname: string, params?: IParams): VCard`

Add an entry to a `NICKNAME` property.

---

### `addPhoto(data: string, params?: IParams): VCard`

Add a `PHOTO` property. `data` may be a URL or a base64 data URI.

---

### `addAddress(street, locality, region, postCode, country, params?: IParams): VCard`

Add an `ADR` property. Each component accepts `string | null | undefined` — `null` and `undefined` are normalized to empty strings:

```ts
vcard.addAddress('123 Main St.', null, undefined, 'AB-123', 'USA', { type: 'home' });
// → ADR;TYPE=home:;;123 Main St.;;;AB-123;USA
```

---

### `addPhone(number: string, params?: IParams): VCard`

Add an entry to a `TEL` property.

---

### `addEmail(email: string, params?: IParams): VCard`

Add an entry to an `EMAIL` property.

---

### `addTitle(title: string, params?: IParams): VCard`

Add an entry to a `TITLE` property.

---

### `addRole(role: string, params?: IParams): VCard`

Add an entry to a `ROLE` property.

---

### `addOrganization(organization: string, organizationUnits?: string[], params?: IParams): VCard`

Add an `ORG` property. `organization` is the primary org name and `organizationUnits` contains optional sub-unit names.

---

### `addNotes(notes: string, params?: IParams): VCard`

Add an entry to a `NOTE` property.

---

### `addUrl(url: string, params?: IParams): VCard`

Add an entry to a `URL` property.

---

### `setRevision(rev: string, params?: IParams): VCard`

Set the `REV` (revision) property.

---

### `setUID(uid: string, params?: IParams): VCard`

Set the `UID` property.

---

### `toString(forceV3 = false): string`
### `toVcard(forceV3 = false): string`

Format the vCard to a string. When `forceV3` is `true`, emits `VERSION:3.0` instead of `4.0` — useful for older parsers, but the rest of the output still follows 4.0 conventions, so the result may not be fully valid 3.0.

---

### `toJSON(): IVCard`

Returns a deep clone of the internal vCard state as a plain object, suitable for serialization or passing to `Formatter.format()`.

## Not yet supported

The following vCard properties are not yet included but may be added in the future.

```
SOURCE, KIND, XML, BDAY, ANNIVERSARY, GENDER, IMPP, LANG, TZ, GEO,
LOGO, MEMBER, RELATED, CATEGORIES, PRODID, SOUND, CLIENTPIDMAP, KEY, FBURL, CALADRURI, CALURI
```

Parsing existing vCard strings is out of scope for this library. For parsing, see [`vcard4`](https://www.npmjs.com/package/vcard4) or [`vcf`](https://www.npmjs.com/package/vcf).

## Contributing

PRs and issues welcome. See `CHANGELOG.md` for the version history.

### Releasing

Releases are automated. To cut a new version:

1. Bump `version` in `package.json` and add a `CHANGELOG.md` entry in a PR. Merge.
2. Tag the merge commit with `vX.Y.Z` matching the new `package.json` version and push the tag:
   ```
   git tag v2.3.0 && git push origin v2.3.0
   ```
3. CircleCI's `publish` job runs on tag push: it installs, builds, lints, tests, and runs `npm publish --access public` using the `NPM_TOKEN` configured in the CircleCI project. A guard step fails the publish if the tag name doesn't match `package.json.version`.

Pre-release tags (e.g. `v2.3.0-beta.1`) are not published automatically — only strict-semver tags (`vMAJOR.MINOR.PATCH`).

## License

MIT
