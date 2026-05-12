<div align="center">

# easy-vcard

### vCards, done thoughtfully.

A small TypeScript builder for [vCard 4.0](https://tools.ietf.org/html/rfc6350) strings — fluent, RFC-correct, zero runtime dependencies. From the team at [**Covve**](https://covve.com).

[![npm version](https://img.shields.io/npm/v/@covve/easy-vcard.svg?style=flat-square&labelColor=0F0F0F&color=D9FB51)](https://www.npmjs.com/package/@covve/easy-vcard)
[![npm downloads](https://img.shields.io/npm/dm/@covve/easy-vcard.svg?style=flat-square&labelColor=0F0F0F&color=D9FB51)](https://www.npmjs.com/package/@covve/easy-vcard)
[![types: TypeScript](https://img.shields.io/npm/types/@covve/easy-vcard.svg?style=flat-square&labelColor=0F0F0F&color=D9FB51)](https://www.typescriptlang.org/)
[![license: MIT](https://img.shields.io/npm/l/@covve/easy-vcard.svg?style=flat-square&labelColor=0F0F0F&color=D9FB51)](./LICENCE.txt)
[![build](https://img.shields.io/circleci/build/github/Covve/easy-vcard/master.svg?style=flat-square&labelColor=0F0F0F&color=D9FB51)](https://circleci.com/gh/Covve/easy-vcard)
[![node](https://img.shields.io/node/v/@covve/easy-vcard.svg?style=flat-square&labelColor=0F0F0F&color=D9FB51)](https://nodejs.org)

</div>

---

The vCard spec is small, but the details bite — escape rules, content-line folding, codepoint-safe UTF-8. `easy-vcard` handles them for you, so you spend your time on your product, not on [RFC 6350](https://tools.ietf.org/html/rfc6350).

- **Fluent builder.** `.addEmail(…).addPhone(…).toString()` and you're done.
- **RFC-correct out of the box.** `,` `;` `\` and newlines escape themselves. Lines fold at 75 octets. Multibyte characters (CJK, emoji, RTL) never tear.
- **Zero runtime dependencies.** ~13 kB on npm. ES2020 output with `.d.ts`.
- **Legacy-friendly when you need it.** Drop to `VERSION:3.0` with one flag.
- **Battle-tested.** 88 tests across escape edge cases, multi-fold lines, i18n, and the awkward corners of the spec.

---

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [What it handles for you](#what-it-handles-for-you)
- [API reference](#api-reference)
- [Not yet supported](#not-yet-supported)
- [Releasing](#releasing)
- [About Covve](#about-covve)
- [License](#license)

## Install

```bash
npm install @covve/easy-vcard
```

> Requires Node.js **≥ 18** (uses the built-in `structuredClone`).

## Quick start

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

console.log(vcard.toString());
```

```vcard
BEGIN:VCARD
VERSION:4.0
FN:Johnny D. Doe-Smith
N:Doe,Smith;John;;Dr.;
NICKNAME:Jonny
TEL;PREF=1;TYPE=home:+1 1221112
EMAIL:jdoe@jdoecomp.co
TITLE:Senior Engineer
ORG:Jdoecomp co.;North Division
END:VCARD
```

Each line is `CRLF`-terminated. Lines over 75 octets fold automatically with `CRLF` + space — you don't opt in.

Prefer plain objects? The `Formatter` accepts an `IVCard` directly:

```ts
import { Formatter } from '@covve/easy-vcard';

const text = new Formatter().format({
  name: { fullNames: ['Johnny D. Doe-Smith'] },
  emails: [{ value: 'jdoe@jdoecomp.co' }],
});
```

## What it handles for you

### Escaping — RFC 6350 §3.4

Pass raw strings. The library escapes `\`, `,`, `;`, and newlines in property values.

```ts
new VCard()
  .setFullName('John')
  .addNotes('Hello, world; with a newline\nbreak')
  .toString();
```

```vcard
NOTE:Hello\, world\; with a newline\nbreak
```

### Line folding — RFC 6350 §3.2

Content lines longer than 75 UTF-8 octets are split with `CRLF` and a single leading space. The folder walks codepoints, not bytes — multibyte characters (`中`, `🍕`, `שלום`, `Müller`) are never split mid-character.

### `VERSION:3.0` fallback

Some legacy parsers reject the 4.0 header. One flag flips it:

```ts
vcard.toString(true);                  // emits VERSION:3.0
new Formatter().format(json, true);    // same
```

The rest of the output still follows 4.0 conventions, so the result may not be fully valid 3.0. Use only when you must.

## API reference

> **`IParams`** is an object of optional parameter keys: `label`, `language`, `value`, `pref`, `altId`, `pid`, `type`, `mediatype`, `calscale`, `sortAs`, `geo`, `timezone`, `encoding`. Not every property accepts every parameter — see the [RFC](https://tools.ietf.org/html/rfc6350) for the matrix.

### Name

| Method | What it does |
|---|---|
| `setFullName(fullName)` | Sets the mandatory `FN` property. If you omit it, one is built from the `N` components |
| `addFirstName(firstName)` | Append to `N` first names |
| `addMiddleName(middleName)` | Append to `N` middle names |
| `addLastName(lastName)` | Append to `N` last names |
| `addPrefixName(pre)` | Append to `N` honorific prefixes |
| `addSuffixName(suf)` | Append to `N` honorific suffixes |

### Contact

| Method | What it does |
|---|---|
| `addNickname(nickname, params?)` | Adds a `NICKNAME` entry |
| `addPhoto(data, params?)` | Adds a `PHOTO` entry. `data` may be a URL or a base64 data URI |
| `addAddress(street, locality, region, postCode, country, params?)` | Adds an `ADR` entry. Each component accepts `string \| null \| undefined` — null and undefined are normalized to `""` |
| `addPhone(number, params?)` | Adds a `TEL` entry |
| `addEmail(email, params?)` | Adds an `EMAIL` entry |
| `addUrl(url, params?)` | Adds a `URL` entry |

```ts
vcard.addAddress('123 Main St.', null, undefined, 'AB-123', 'USA', { type: 'home' });
// → ADR;TYPE=home:;;123 Main St.;;;AB-123;USA
```

### Work

| Method | What it does |
|---|---|
| `addTitle(title, params?)` | Adds a `TITLE` entry |
| `addRole(role, params?)` | Adds a `ROLE` entry |
| `addOrganization(organization, organizationUnits?, params?)` | Adds an `ORG` entry. `organizationUnits` lists sub-unit names beneath the primary name |

### Misc

| Method | What it does |
|---|---|
| `addNotes(notes, params?)` | Adds a `NOTE` entry |
| `setRevision(rev, params?)` | Sets the `REV` property |
| `setUID(uid, params?)` | Sets the `UID` property |

### Output

| Method | Returns |
|---|---|
| `toString(forceV3 = false)` | Formatted vCard string |
| `toVcard(forceV3 = false)` | Alias for `toString` |
| `toJSON()` | Deep clone of the internal state as a plain `IVCard` object — pass it to `Formatter.format(…)` or serialize it however you like |

## Not yet supported

The following vCard properties are not yet implemented. PRs welcome.

```
SOURCE  KIND  XML  BDAY  ANNIVERSARY  GENDER  IMPP  LANG  TZ  GEO
LOGO  MEMBER  RELATED  CATEGORIES  PRODID  SOUND  CLIENTPIDMAP
KEY  FBURL  CALADRURI  CALURI
```

**Parsing existing vCard strings is out of scope** — `easy-vcard` is a one-way formatter. For parsing, reach for [`vcard4`](https://www.npmjs.com/package/vcard4) or [`vcf`](https://www.npmjs.com/package/vcf).

## Releasing

Publishes are automated by CircleCI.

1. Bump `version` in `package.json` and add a `CHANGELOG.md` entry in a PR. Merge to `master`.
2. Tag the merge commit with `vX.Y.Z` (must match `package.json`) and push:
   ```bash
   git tag v2.3.0 && git push origin v2.3.0
   ```
3. The `publish` job runs on tag push: install, build, lint, test, verify the tag matches `package.json.version`, then `npm publish --access public` using the `NPM_TOKEN` project env var.

Only strict-semver tags (`vMAJOR.MINOR.PATCH`) auto-publish. Pre-release tags like `v2.3.0-beta.1` do not.

## About Covve

[**Covve**](https://covve.com) helps professionals turn fleeting encounters into connections that matter. We build tools that cultivate networks with care — Covve's Business Card Scanner for capturing leads, a Scanning API that powers contact intake inside other products, and a CRM that follows up so you don't have to.

`easy-vcard` is one of the small pieces underneath all of that — open-sourced because vCard handling is something every contact tool should get right.

| | |
|---|---|
| Website | [covve.com](https://covve.com) |
| Issues & PRs | [github.com/Covve/easy-vcard](https://github.com/Covve/easy-vcard) |

## License

[MIT](./LICENCE.txt) © [Covve](https://covve.com)
