/**
 * Export a .vcard or .vcf to a location for testing purposes.
 * Edit fields as appropriate.
 */

import { VCard, Formatter } from "../src/index"
import { writeFile } from "fs";

// construct your card here
const vcard = new VCard();

vcard.name.firstNames = ['John'];
vcard.name.lastNames = ['Doe', 'Foo'];
vcard.name.honorificsPre = ['Dr.'];
vcard.emails.push({ value: 'jdoe@smithsonian.com' });
vcard.emails.push({ value: 'doesupports@smithsonian.com' });
vcard.uid.value = 'urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6';
vcard.revision.value = '1';
vcard.notes.push({ value: 'Jdoe\'s personal notes'});
vcard.phones.push({ value: '0-123456', params: { type: 'home', value: 'text' } });
vcard.phones.push({ value: 'tel:123-456-789', params: { type: 'work', pref: '1', value: 'uri' } });
vcard.titles.push({ value: 'Chief support officer' });
vcard.organizations.push({ values: ['Smithsonian Inc.', 'North America'] });
vcard.organizations.push({ values: ['Jdoe co.'] });
vcard.addresses.push({
  street: '123 High Str.',
  country: 'USA',
  postCode: 'AB-123',
  params: { type: 'home', label: 'Doe Residence, 123 High Str., AB-123, US' }
});
vcard.roles.push({ value: 'Support manager' });

// set the path
const path = "test.vcard";

// let it do it's thang
Export(vcard, path);


/**** HELPER ****/

function Export(vcard: VCard, filepath: string, ext = '.vcard') {
  const formatter = new Formatter();
  const vcardString = formatter.format(vcard);
  if(!vcardString){
    console.error('Empty string returned. Please check that your vcard is well defined');
    return;
  }

  if ((filepath.indexOf('.vcard') !== -1) || (filepath.indexOf('.vcf')))
    writeFile(filepath, vcardString, null);
  else
    writeFile(filepath + ext, vcardString, null);
}
