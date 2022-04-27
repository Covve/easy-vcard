import { VCard } from "../vcard/vcard";
import { Formatter } from "./formatter";

describe("Formatter", () => {
  it("prints a VCard with fullName", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({ name: { fullNames: ["John K. Doe"] } });
    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" + "VERSION:4.0\r\n" + "FN:John K. Doe\r\n" + "END:VCARD"
    );
  });

  it("formats a VCard with both fullName and name components", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John K. Doe"],
        firstNames: ["John"],
        middleNames: ["K.", "M."],
        lastNames: ["Doe", "Smith"],
        honorificsPre: ["Dr."],
        honorificsSuf: ["Esq."],
      },
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John K. Doe\r\n" +
        "N:Doe,Smith;John;K.,M.;Dr.;Esq.\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with both fullName and nickname components", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John K. Doe"],
        firstNames: ["John"],
        middleNames: ["K.", "M."],
        lastNames: ["Doe", "Smith"],
        honorificsPre: ["Dr."],
        honorificsSuf: ["Esq."],
      },
      nicknames: [{ value: "Jonny" }],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John K. Doe\r\n" +
        "N:Doe,Smith;John;K.,M.;Dr.;Esq.\r\n" +
        "NICKNAME:Jonny\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with fullName from first name components if not provided", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        firstNames: ["John", "Jack"],
        middleNames: ["K.", "M."],
        lastNames: ["Doe", "Smith"],
        honorificsSuf: ["Esq.", "Esq2."],
      },
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John K. Doe Esq.\r\n" +
        "N:Doe,Smith;John,Jack;K.,M.;;Esq.,Esq2.\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a base64 photo", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      photos: [
        {
          value: "http://www.example.com/pub/photos/jqpublic.gif",
        },
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "PHOTO:http://www.example.com/pub/photos/jqpublic.gif\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a photo url", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      photos: [
        {
          value: "data:image/jpeg;base64,MIICajCCAdOgAwIBAgICBEUwDQYJKoZIhv",
        },
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "PHOTO:data:image/jpeg;base64,MIICajCCAdOgAwIBAgICBEUwDQYJKoZIhv\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with an address", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      addresses: [
        {
          street: "someStreet",
          locality: "someLocality",
          region: "someRegion",
          postCode: "somePostCode",
          country: "someCountry",
        },
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "ADR:;;someStreet;someLocality;someRegion;somePostCode;someCountry\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with addresses in a more complicated scenario", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      addresses: [
        {
          street: "someStreet",
          locality: "someLocality",
          region: "someRegion",
          country: "someCountry",
        },
        {
          street: "otherStreet",
          region: "otherRegion",
          params: { type: "HOME" },
        },
        {},
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "ADR:;;someStreet;someLocality;someRegion;;someCountry\r\n" +
        "ADR;TYPE=HOME:;;otherStreet;;otherRegion;;\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a phone", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      phones: [
        {
          value: "+10 012345",
          params: { value: "text" },
        },
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "TEL;VALUE=text:+10 012345\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with phones in a more complicated scenario", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      phones: [
        {
          value: "+10 012345",
          params: { value: "text", pref: "1", type: "voice,home" },
        },
        {
          value: "tel:+1-555-555-5555;ext=5555",
          params: { value: "uri" },
        },
        {},
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        'TEL;VALUE=text;PREF=1;TYPE="voice,home":+10 012345\r\n' +
        "TEL;VALUE=uri:tel:+1-555-555-5555;ext=5555\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard an email", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      emails: [
        {
          value: "jdoe@smithsonian.com",
          params: { type: "work", pref: "1" },
        },
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "EMAIL;PREF=1;TYPE=work:jdoe@smithsonian.com\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with emails in a more complicated scenario", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      emails: [
        {
          value: "jdoe@smithsoni\nan.com",
          params: { type: "work", pref: "1" },
        },
        { value: "jdo,e2@smith sonian.com", params: <any>{ type: null } },
        {},
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "EMAIL;PREF=1;TYPE=work:jdoe@smithsoni\\nan.com\r\n" +
        "EMAIL:jdo,e2@smith sonian.com\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a job title", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      titles: [{ value: "Chief Officer" }],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "TITLE:Chief Officer\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with titles in a more complicated scenario", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      titles: [
        { value: "Chief, officer\n", params: { pid: "1" } },
        { value: "Father of 3", params: { pid: "2", altId: "3" } },
        {},
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "TITLE;PID=1:Chief, officer\\n\r\n" +
        "TITLE;ALTID=3;PID=2:Father of 3\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a job role", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      roles: [{ value: "Project leader" }],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "ROLE:Project leader\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with roles in a more complicated scenario", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      roles: [
        { value: "Project, Lead;-er\n", params: { pid: "1" } },
        { value: "\n\nFounder", params: { pid: "2", altId: "3" } },
        {},
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "ROLE;PID=1:Project, Lead;-er\\n\r\n" +
        "ROLE;ALTID=3;PID=2:\\n\\nFounder\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with an organization", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      organizations: [{ values: ["Covve Ltd."] }],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "ORG:Covve Ltd.\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with roles in a more complicated scenario", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      organizations: [
        { values: ["Covve Ltd.", "North American Division\nUSA"] },
        {
          values: ["Greatworks", "Lumber Company", "Inc.\n"],
          params: { type: "main" },
        },
        {},
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "ORG:Covve Ltd.;North American Division\\nUSA\r\n" +
        "ORG;TYPE=main:Greatworks;Lumber Company;Inc.\\n\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a note entry", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      notes: [{ value: "Something noted" }],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "NOTE:Something noted\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with notes in a more complicated scenario", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      notes: [
        {
          value: "Something noted\nwith many\nlines, of text",
          params: { language: "En" },
        },
        { value: "\nAnother note" },
        {},
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "NOTE;LANGUAGE=En:Something noted\\nwith many\\nlines, of text\r\n" +
        "NOTE:\\nAnother note\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a url entry", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      url: [{ value: "https://www.covve.com" }],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "URL:https://www.covve.com\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with urls in a more complicated scenario", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      url: [
        { value: "http://covve.com", params: { mediatype: "text/plain" } },
        { value: "\ncovve.com\n\n" },
        {},
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "URL;MEDIATYPE=text/plain:http://covve.com\r\n" +
        "URL:\\ncovve.com\\n\\n\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a revision", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      revision: { value: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6" },
    });
    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "REV:f81d4fae-7dec-11d0-a765-00a0c91e6bf6\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a uid", () => {
    let sut = new Formatter();
    let vcard: any = new VCard({
      name: {
        fullNames: ["John"],
      },
      uid: { value: "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6" },
    });
    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "UID:urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6\r\n" +
        "END:VCARD"
    );
  });

  describe("params", () => {
    it("formats all params", () => {
      let sut = new Formatter();
      let vcard: any = new VCard({
        name: {
          fullNames: ["John"],
          params: {
            label: "someLabel",
            language: "someLanguage",
            value: "someValue",
            pref: "somePref",
            altId: "someAltId",
            pid: "somePid",
            type: "someType",
            mediatype: "someMediaType",
            calscale: "someCalScale",
            sortAs: "someSortAs",
            geo: "someGeo",
            timezone: "someTimeZone",
            encoding: "b",
          },
        },
      });

      const expectedParamString =
        ";LABEL=someLabel;LANGUAGE=someLanguage;VALUE=someValue;PREF=somePref;ALTID=someAltId;" +
        "PID=somePid;TYPE=someType;MEDIATYPE=someMediaType;CALSCALE=someCalScale;" +
        "SORT-AS=someSortAs;GEO=someGeo;TZ=someTimeZone;ENCODING=b";
      expect(sut.format(vcard.toJSON())).toEqual(
        "BEGIN:VCARD\r\n" +
          "VERSION:4.0\r\n" +
          "FN" +
          expectedParamString +
          ":John\r\n" +
          "END:VCARD"
      );
    });

    it("sanitizes params", () => {
      let sut = new Formatter();
      let vcard: any = new VCard({
        name: {
          fullNames: ["John"],
          params: {
            label: "some\nla\nbel",
            language: "some:Language",
            value: '"someValue"',
            pref: "some:Pref",
            altId: "some,AltId",
            pid: "somePid;",
            type: "someType;;",
            mediatype: "some:MediaType",
            calscale: "someC,,alScale",
            sortAs: ",someSortAs",
            geo: ":someGeo",
            timezone: 'so:me"Ti"meZone',
            encoding: 'b:"tM"',
          },
        },
      });

      const expectedParamString =
        ';LABEL=some\\nla\\nbel;LANGUAGE="some:Language";VALUE=someValue;PREF="some:Pref";ALTID="some,AltId";' +
        'PID="somePid;";TYPE="someType;;";MEDIATYPE="some:MediaType";CALSCALE="someC,,alScale";' +
        'SORT-AS=",someSortAs";GEO=":someGeo";TZ="so:meTimeZone";ENCODING="b:tM"';
      expect(sut.format(vcard.toJSON())).toEqual(
        "BEGIN:VCARD\r\n" +
          "VERSION:4.0\r\n" +
          "FN" +
          expectedParamString +
          ":John\r\n" +
          "END:VCARD"
      );
    });

    describe("complete examples", () => {
      it("construct a vcard then format it", () => {
        let sut = new Formatter();
        let vcard: any = new VCard({
          name: {
            firstNames: ["John"],
            lastNames: ["Doe", "Foo"],
            honorificsPre: ["Dr."],
          },
          emails: [
            { value: "jdoe@smithsonian.com" },
            { value: "doesupports@smithsonian.com" },
          ],
          uid: { value: "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6" },
          revision: { value: "1" },
          notes: [{ value: "Jdoe's personal notes" }],
          phones: [
            { value: "0-123456", params: { type: "home", value: "text" } },
            {
              value: "tel:123-456-789",
              params: { type: "work", pref: "1", value: "uri" },
            },
          ],
          titles: [{ value: "Chief support officer" }],
          organizations: [
            { values: ["Smithsonian Inc.", "North America"] },
            { values: ["Jdoe co."] },
          ],
          addresses: [
            {
              street: "123 High Str.",
              country: "USA",
              postCode: "AB-123",
              params: {
                type: "home",
                label: "Doe Residence, 123 High Str., AB-123, US",
              },
            },
          ],
          roles: [{ value: "Support manager" }],
        });

        const result = sut.format(vcard.toJSON());
        expect(result).toEqual(
          "BEGIN:VCARD\r\n" +
            "VERSION:4.0\r\n" +
            "FN:Dr. John Doe\r\n" +
            "N:Doe,Foo;John;;Dr.;\r\n" +
            'ADR;LABEL="Doe Residence, 123 High Str., AB-123, US";TYPE=home:;;123 High Str.;;;AB-123;USA\r\n' +
            "TEL;VALUE=text;TYPE=home:0-123456\r\n" +
            "TEL;VALUE=uri;PREF=1;TYPE=work:tel:123-456-789\r\n" +
            "EMAIL:jdoe@smithsonian.com\r\n" +
            "EMAIL:doesupports@smithsonian.com\r\n" +
            "TITLE:Chief support officer\r\n" +
            "ROLE:Support manager\r\n" +
            "ORG:Smithsonian Inc.;North America\r\n" +
            "ORG:Jdoe co.\r\n" +
            "NOTE:Jdoe's personal notes\r\n" +
            "REV:1\r\n" +
            "UID:urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6\r\n" +
            "END:VCARD"
        );
      });
    });
  });
});
