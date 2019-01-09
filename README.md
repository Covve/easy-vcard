# Easy-vcard

Create vcards and format to strings to export in `.vcf` or `.vcard` files. This is an implementation of the version 4.0 vcard in Typescript according to [RFC6350](https://tools.ietf.org/html/rfc6350). This is an early version an many vcard fields or properties might not be supported. Check below for what's included.

## Installation

`npm install --save @covve/easy-vcard`

## Usage

Examples are written with Typescript in mind but you should be able to use it in nodejs projects as well. Below we construct a simple vcard and export it.

```
  let vcard = new VCard();
  vcard.setFullName('Johnny D. Doe-Smith')
    .addFirstName('John')
    .addLastName('Doe')
    .addLastName('Smith')
    .addPrefixName('Dr.')
    .addPhone('+1 1221112', { pref: '1', type: 'home' })
    .addEmail('jdoe@jdoecomp.co')
    .addTitle('Senior Engineer')
    .addOrganization('Jdoecomp co.', ['North Division']);

  let formatter = new Formatter();
  let formattedText = formatter.format(vcard);
  \\ This should output the following
  \\ "BEGIN:VCARD
  \\  VERSION:4.0
  \\  FN:Johnny D. Doe-Smith
  \\  N:Doe,Smith;John;;Dr.;
  \\  TEL;PREF=1;TYPE=home:+1 1221112
  \\  EMAIL:jdoe@jdoecomp.co
  \\  TITLE:Senior Engineer
  \\  ORG:Jdoecomp co.;North Division
  \\  END:VCARD"
  \\
  \\ which you can save to a filesystem as .vcf or encode it in a barcode or whatever

```

## VCard methods

_Note: IParams refers to a javascript object containing parameters used in certain vCard properties. Some methods support this, some don't. Refer to the RFC aforementioned or source/examples of this project for more details._


### `setFullName(fullName: string)`
Set the FN property of the vcard. This is mandatory and unique. If it doesn't exist, one will be created from name components from the N property.

---------------------------------------------------------------------------------------------------------------------------------------------------
### `addFirstName(firstName: string): VCard`
### `addMiddleName(middleName: string): VCard`
### `addLastName(lastName: string): VCard`
### `addPrefixName(pre: string): VCard`
### `addSuffixName(suf: string): VCard`
Add a first name, middle name, last name, honorific prefix or honorific suffix respectively in the N property. The N property is unique if it exists.

---------------------------------------------------------------------------------------------------------------------------------------------------

### `addAddress(street: string, locality: string, region: string, postCode: string, country: string, params?: IParams): VCard`
Add an address as an ADR property. Fields not available should be null or undefined.

---------------------------------------------------------------------------------------------------------------------------------------------------

### `addPhone(number: string, params?: IParams): VCard`
Add a phone number to a TEL property.

---------------------------------------------------------------------------------------------------------------------------------------------------

### `addEmail(email: string, params?: IParams): VCard`
Add an email to an EMAIL property.

---------------------------------------------------------------------------------------------------------------------------------------------------

### `addTitle(title: string, params?: IParams): VCard`
Add a title in the list of the TITLE property.

---------------------------------------------------------------------------------------------------------------------------------------------------

### `addRole(role: string, params?: IParams): VCard`
Add a role in the list of the ROLE property.

---------------------------------------------------------------------------------------------------------------------------------------------------

### `addOrganization(organization: string, organizationUnits: string[], params?: IParams): VCard`
Add an organization to an ORG property. Organization refers to the main name of the company and organizationUnits to second or more unit names.

---------------------------------------------------------------------------------------------------------------------------------------------------

### `addNotes(notes: string, params?: IParams): VCard`
Add a notes entry in a NOTE property.

---------------------------------------------------------------------------------------------------------------------------------------------------

### `setRevision(rev: string, params?: IParams): VCard`
Set the revision for this vcard.

---------------------------------------------------------------------------------------------------------------------------------------------------

### `setUID(uid: string, params?: IParams): VCard`
Set the user id for this vcard.


## Formatter methods

After creating a formatter object there's only one method you can use.

---------------------------------------------------------------------------------------------------------------------------------------------------

### `format(vCard: VCard, forceV3 = false): string`
Takes a VCard object as created above and formats it into a string. Note that a forceV3 argument is included, which if true, set the VERSION property to 3.0 .
This doesn't mean that this plugin supports 3.0 vcards or earlier, it's just a workaround to get your simple vcards read by older parsers found in various devices.
Care should be taken using this as the card might not be readable by 3.0 or older parsers.

---------------------------------------------------------------------------------------------------------------------------------------------------

## Not yet supported

The following vCard properties are not yet included but might be in the future.
```
SOURCE, KIND, XML, NICKNAME, PHOTO, BDAY, ANNIVERSARY, GENDER, IMPP, LANG, TZ, GEO,
LOGO, MEMBER, RELATED, CATEGORIES, PRODID, SOUND, CLIENTPIDMAP, URL, KEY, FBURL, CALADRURI, CALURI
```
## Contribute

Feel free to submit PRs or open issues with improvements or bug fixes.

## LICENSE

MIT
