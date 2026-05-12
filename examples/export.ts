/**
 * Export a .vcard or .vcf to a location for testing purposes.
 * Edit fields as appropriate.
 *
 * Run through package.json as 'npm run export'.
 */

import { writeFile } from "fs";
import { VCard } from "../src/index";

// Construct a sample vcard. Notice:
//   - addAddress accepts `null` / `undefined` for any missing component
//   - commas and semicolons in text values are escaped automatically
//   - the URL value is long enough to trigger RFC6350 line folding at 75 octets
const vcard = new VCard()
  .addFirstName("John")
  .addLastName("Doe")
  .addLastName("Foo")
  .addPrefixName("Dr.")
  .addEmail("jdoe@smithsonian.com")
  .addEmail("doesupports@smithsonian.com")
  .setUID("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6")
  .setRevision("1")
  .addNotes("Notes with a comma, a semicolon; and a newline\nare escaped correctly.")
  .addNickname("Jonny")
  .addPhone("0-123456", { type: "home", value: "text" })
  .addPhone("tel:123-456-789", { type: "work", pref: "1", value: "uri" })
  .addTitle("Chief support officer")
  .addOrganization("Smithsonian Inc.", ["North America"])
  .addOrganization("Jdoe co.")
  .addAddress("123 High Str.", null, undefined, "AB-123", "USA", {
    type: "home",
    label: "Doe Residence, 123 High Str., AB-123, US",
  })
  .addRole("Support manager")
  .addUrl("https://www.smithsonian.com/this-is-a-deliberately-long-url-to-show-line-folding")
  .addPhoto(
    "MIICajCCAdOgAwIBAgICBEUwDQYJKoZIhvcNAQEEBQAwdzELMAkGA1UEBhMCVVMxLDAqBgNVBAoTI05ldHNjYXBlIENvbW11bmljYXRpb25zIENvcnBvcmF0aW9uMRwwGgYDVQQLExNJbmZvcm1hdGlvbi",
    { type: "image/jpeg", encoding: "b" }
  );

// Pick a path. Extensions .vcard and .vcf are kept as-is; anything else
// gets the default extension appended.
const path = "test.vcard";

writeVcard(vcard, path);

function writeVcard(card: VCard, filepath: string, ext = ".vcard"): void {
  const vcardString = card.toString();
  if (!vcardString) {
    console.error("Empty string returned. Please check that your vcard is well defined.");
    return;
  }

  const finalPath =
    filepath.endsWith(".vcard") || filepath.endsWith(".vcf")
      ? filepath
      : filepath + ext;

  writeFile(finalPath, vcardString, (err) => {
    if (err) throw err;
    console.log(`file written successfully to ${finalPath}`);
  });
}
