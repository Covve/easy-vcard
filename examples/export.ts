/**
 * Export a .vcard or .vcf to a location for testing purposes.
 * Edit fields as appropriate.
 *
 * Run through package.json as 'npm run export'
 */

import { writeFile } from "fs";
import { Formatter, VCard } from "../src/index";

// construct your card here
const vcard = new VCard();

vcard
  .addFirstName("John")
  .addLastName("Doe")
  .addLastName("Foo")
  .addPrefixName("Dr.")
  .addEmail("jdoe@smithsonian.com")
  .addEmail("doesupports@smithsonian.com")
  .setUID("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6")
  .setRevision("1")
  .addNotes("Jdoe's personal notes")
  .addNickname("Jonny")
  .addPhone("0-123456", { type: "home", value: "text" })
  .addPhone("tel:123-456-789", { type: "work", pref: "1", value: "uri" })
  .addTitle("Chief support officer")
  .addOrganization("Smithsonian Inc.", ["North America"])
  .addOrganization("Jdoe co.", [])
  .addAddress("123 High Str.", "", "", "AB-123", "USA", {
    type: "home",
    label: "Doe Residence, 123 High Str., AB-123, US",
  })
  .addRole("Support manager")
  .addUrl("www.smithsonian.com")
  .addPhoto(
    "MIICajCCAdOgAwIBAgICBEUwDQYJKoZIhvcNAQEEBQAwdzELMAkGA1UEBhMCVVMxLDAqBgNVBAoTI05ldHNjYXBlIENvbW11bmljYXRpb25zIENvcnBvcmF0aW9uMRwwGgYDVQQLExNJbmZvcm1hdGlvbi",
    { type: "image/jpeg", encoding: "b" }
  );

// set the path
const path = "test.vcard";

// let it do it's thang
Export(vcard, path);

/**** HELPER ****/

function Export(vcard: VCard, filepath: string, ext = ".vcard") {
  const formatter = new Formatter();
  const vcardString = formatter.format(vcard.toJSON());
  if (!vcardString) {
    console.error(
      "Empty string returned. Please check that your vcard is well defined"
    );
    return;
  }

  if (filepath.indexOf(".vcard") !== -1 || filepath.indexOf(".vcf"))
    writeFile(filepath, vcardString, errorHandler);
  else writeFile(filepath + ext, vcardString, errorHandler);
}

function errorHandler(err) {
  if (err) throw err;
  console.log("file written successfully");
}
