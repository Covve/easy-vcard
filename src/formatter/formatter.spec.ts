import { IParams, VCard } from "../vcard/vcard";
import { Formatter } from "./formatter";

describe("Formatter", () => {
  it("prints a VCard with fullName", () => {
    const sut = new Formatter();
    const vcard = new VCard({ name: { fullNames: ["John K. Doe"] } });
    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" + "VERSION:4.0\r\n" + "FN:John K. Doe\r\n" + "END:VCARD"
    );
  });

  it("formats a VCard with both fullName and name components", () => {
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
        "PHOTO:data:image/jpeg\\;base64\\,MIICajCCAdOgAwIBAgICBEUwDQYJKoZIhv\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with an address", () => {
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
        "TEL;VALUE=uri:tel:+1-555-555-5555\\;ext=5555\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard an email", () => {
    const sut = new Formatter();
    const vcard = new VCard({
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

  it('formats a VCard with emails in a more complicated scenario', () => {
    const sut = new Formatter();
    const vcard = new VCard({
      name: {
        fullNames: ["John"],
      },
      emails: [
        {
          value: "jdoe@smithsoni\nan.com",
          params: { type: "work", pref: "1" },
        },
        { value: "jdo,e2@smith sonian.com", params: { type: null } as unknown as IParams},
        {},
      ],
    });

    expect(sut.format(vcard.toJSON())).toEqual(
      "BEGIN:VCARD\r\n" +
        "VERSION:4.0\r\n" +
        "FN:John\r\n" +
        "EMAIL;PREF=1;TYPE=work:jdoe@smithsoni\\nan.com\r\n" +
        "EMAIL:jdo\\,e2@smith sonian.com\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a job title", () => {
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
        "TITLE;PID=1:Chief\\, officer\\n\r\n" +
        "TITLE;ALTID=3;PID=2:Father of 3\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a job role", () => {
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
        "ROLE;PID=1:Project\\, Lead\\;-er\\n\r\n" +
        "ROLE;ALTID=3;PID=2:\\n\\nFounder\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with an organization", () => {
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
        "NOTE;LANGUAGE=En:Something noted\\nwith many\\nlines\\, of text\r\n" +
        "NOTE:\\nAnother note\r\n" +
        "END:VCARD"
    );
  });

  it("formats a VCard with a url entry", () => {
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
    const sut = new Formatter();
    const vcard = new VCard({
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
      const sut = new Formatter();
      const vcard = new VCard({
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

      expect(sut.format(vcard.toJSON())).toEqual(
        "BEGIN:VCARD\r\n" +
          "VERSION:4.0\r\n" +
          "FN;LABEL=someLabel;LANGUAGE=someLanguage;VALUE=someValue;PREF=somePref;ALTI\r\n" +
          " D=someAltId;PID=somePid;TYPE=someType;MEDIATYPE=someMediaType;CALSCALE=some\r\n" +
          " CalScale;SORT-AS=someSortAs;GEO=someGeo;TZ=someTimeZone;ENCODING=b:John\r\n" +
          "END:VCARD"
      );
    });

    it("sanitizes params", () => {
      const sut = new Formatter();
      const vcard = new VCard({
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

      expect(sut.format(vcard.toJSON())).toEqual(
        "BEGIN:VCARD\r\n" +
          "VERSION:4.0\r\n" +
          'FN;LABEL=some\\nla\\nbel;LANGUAGE="some:Language";VALUE=someValue;PREF="some:\r\n' +
          ' Pref";ALTID="some,AltId";PID="somePid;";TYPE="someType;;";MEDIATYPE="some:M\r\n' +
          ' ediaType";CALSCALE="someC,,alScale";SORT-AS=",someSortAs";GEO=":someGeo";TZ\r\n' +
          ' ="so:meTimeZone";ENCODING="b:tM":John\r\n' +
          "END:VCARD"
      );
    });

    describe("complete examples", () => {
      it("construct a vcard then format it", () => {
        const sut = new Formatter();
        const vcard = new VCard({
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
            'ADR;LABEL="Doe Residence, 123 High Str., AB-123, US";TYPE=home:;;123 High S\r\n tr.;;;AB-123;USA\r\n' +
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

  describe("RFC6350 value escaping", () => {
    it("escapes backslash, comma, semicolon, and newlines in text values", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        notes: [{ value: "back\\slash, comma; semi\nnewline\r\ncrlf" }],
      });
      expect(sut.format(vcard.toJSON())).toEqual(
        "BEGIN:VCARD\r\n" +
          "VERSION:4.0\r\n" +
          "FN:John\r\n" +
          "NOTE:back\\\\slash\\, comma\\; semi\\nnewline\\ncrlf\r\n" +
          "END:VCARD"
      );
    });

    it("escapes a backslash before applying other escapes (order matters)", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        notes: [{ value: "\\," }],
      });
      // The literal "\," should become "\\\\\\," (backslash escaped first, then comma)
      expect(sut.format(vcard.toJSON())).toEqual(
        "BEGIN:VCARD\r\n" +
          "VERSION:4.0\r\n" +
          "FN:John\r\n" +
          "NOTE:\\\\\\,\r\n" +
          "END:VCARD"
      );
    });
  });

  describe("line folding (RFC6350 §3.2)", () => {
    it("folds lines longer than 75 octets with CRLF + space", () => {
      const sut = new Formatter();
      const longNote = "x".repeat(100);
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        notes: [{ value: longNote }],
      });
      const output = sut.format(vcard.toJSON());
      // The NOTE line is "NOTE:" + 100 x's = 105 octets.
      // First segment: 75 octets (NOTE: + first 70 x's). Continuation: " " + remaining 30 x's.
      expect(output).toContain(
        "NOTE:" + "x".repeat(70) + "\r\n " + "x".repeat(30)
      );
    });

    it("does not fold lines exactly 75 octets long", () => {
      const sut = new Formatter();
      // "NOTE:" (5) + 70 x's = 75 octets
      const note = "x".repeat(70);
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        notes: [{ value: note }],
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("NOTE:" + note + "\r\nEND:VCARD");
    });

    it("does not split multibyte UTF-8 codepoints across folds", () => {
      const sut = new Formatter();
      // Each "€" is 3 UTF-8 bytes. 25 €'s = 75 bytes. "NOTE:" (5) + 25 €'s = 80 bytes → fold.
      // The fold must not happen mid-codepoint; the segment lengths must each be valid UTF-8.
      const note = "€".repeat(25);
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        notes: [{ value: note }],
      });
      const output = sut.format(vcard.toJSON());
      // Unfold the entire output by removing each "CRLF + SPACE" sequence
      const unfolded = output.replace(/\r\n /g, "");
      expect(unfolded).toContain("NOTE:" + note);
      // Each physical line of the folded output must be valid UTF-8 (no torn codepoint).
      // If a codepoint were split, the high/low surrogate bytes would not round-trip cleanly.
      for (const line of output.split("\r\n")) {
        const bytes = Buffer.from(line, "utf8");
        expect(bytes.toString("utf8")).toEqual(line);
      }
    });
  });

  describe("version handling", () => {
    it("emits VERSION:3.0 when forceV3 is true", () => {
      const sut = new Formatter();
      const vcard = new VCard({ name: { fullNames: ["John"] } });
      expect(sut.format(vcard.toJSON(), true)).toEqual(
        "BEGIN:VCARD\r\n" + "VERSION:3.0\r\n" + "FN:John\r\n" + "END:VCARD"
      );
    });
  });

  describe("error cases", () => {
    it("throws when formatting a vcard with no name entries", () => {
      const sut = new Formatter();
      const vcard = new VCard();
      expect(() => sut.format(vcard.toJSON())).toThrow(
        /name is mandatory/
      );
    });
  });

  describe("internationalization", () => {
    it("preserves CJK characters in name and notes", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["山田 太郎"], firstNames: ["太郎"], lastNames: ["山田"] },
        notes: [{ value: "中文笔记和日本語のメモ" }],
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("FN:山田 太郎");
      expect(output).toContain("N:山田;太郎;;;");
      expect(output).toContain("NOTE:中文笔记和日本語のメモ");
    });

    it("preserves RTL scripts (Arabic, Hebrew)", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["محمد علي"] },
        notes: [{ value: "שלום עולם" }],
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("FN:محمد علي");
      expect(output).toContain("NOTE:שלום עולם");
    });

    it("preserves accented Latin and Cyrillic", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["François Müller"] },
        notes: [{ value: "Привет, мир" }],
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("FN:François Müller");
      // Cyrillic note has a comma → must be escaped
      expect(output).toContain("NOTE:Привет\\, мир");
    });

    it("preserves emoji including astral-plane codepoints", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["Pizza 🍕"] },
        notes: [{ value: "Family 👨‍👩‍👧‍👦 and a flag 🇬🇷" }],
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("FN:Pizza 🍕");
      expect(output).toContain("NOTE:Family 👨‍👩‍👧‍👦 and a flag 🇬🇷");
    });

    it("folds CJK content without splitting codepoints", () => {
      const sut = new Formatter();
      // 30 × "中" (3 bytes each = 90 bytes) plus "NOTE:" (5 bytes) = 95 bytes → must fold.
      const note = "中".repeat(30);
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        notes: [{ value: note }],
      });
      const output = sut.format(vcard.toJSON());
      const unfolded = output.replace(/\r\n /g, "");
      expect(unfolded).toContain("NOTE:" + note);
      // Each physical line must be valid standalone UTF-8.
      for (const line of output.split("\r\n")) {
        const bytes = Buffer.from(line, "utf8");
        expect(bytes.toString("utf8")).toEqual(line);
      }
    });

    it("folds emoji (4-byte UTF-8 codepoints) without tearing surrogate pairs", () => {
      const sut = new Formatter();
      // "🍕" is U+1F355, encoded as 4 bytes in UTF-8 (and a surrogate pair in JS strings).
      // 20 × 🍕 = 80 bytes + "NOTE:" (5 bytes) = 85 bytes → must fold.
      const note = "🍕".repeat(20);
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        notes: [{ value: note }],
      });
      const output = sut.format(vcard.toJSON());
      const unfolded = output.replace(/\r\n /g, "");
      expect(unfolded).toContain("NOTE:" + note);
      for (const line of output.split("\r\n")) {
        // A torn surrogate would appear as a U+FFFD replacement char after round-trip.
        expect(line).not.toContain("�");
      }
    });
  });

  describe("special characters and escape combinations", () => {
    it("escapes every RFC6350 special char in a single value", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        notes: [{ value: "a\\b,c;d\ne\r\nf" }],
      });
      expect(sut.format(vcard.toJSON())).toContain(
        "NOTE:a\\\\b\\,c\\;d\\ne\\nf"
      );
    });

    it("escapes commas and semicolons in name component lists", () => {
      const sut = new Formatter();
      // Last names containing commas should be escaped so the component
      // separator semantics are preserved.
      const vcard = new VCard({
        name: {
          fullNames: ["Smith Jr., John"],
          firstNames: ["John"],
          lastNames: ["Smith, Jr."],
        },
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("FN:Smith Jr.\\, John");
      // Inside an N field, the comma is a multi-value separator. A literal
      // comma in a single last name must be escaped.
      expect(output).toContain("N:Smith\\, Jr.;John;;;");
    });

    it("escapes semicolons inside address components", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        addresses: [
          {
            street: "Main; St.",
            locality: "City, Town",
            region: "",
            postCode: "",
            country: "USA",
          },
        ],
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("ADR:;;Main\\; St.;City\\, Town;;;USA");
    });

    it("escapes semicolons inside ORG values without affecting unit separators", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        organizations: [{ values: ["Acme; Co.", "R&D, Inc."] }],
      });
      const output = sut.format(vcard.toJSON());
      // The `;` between the two org units is a literal separator (unescaped),
      // but `;` inside a single unit must be escaped.
      expect(output).toContain("ORG:Acme\\; Co.;R&D\\, Inc.");
    });

    it("strips double quotes and escapes newlines inside parameter values", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        phones: [{ value: "+1", params: { label: 'Home "Main"\nLine' } }],
      });
      const output = sut.format(vcard.toJSON());
      // Double quotes are stripped; newline is escaped to "\n".
      expect(output).toContain("TEL;LABEL=Home Main\\nLine:+1");
    });

    it("preserves whitespace-only values (treated as truthy strings)", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: [" "] },
        notes: [{ value: "   " }],
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("FN: ");
      expect(output).toContain("NOTE:   ");
    });

    it("skips properties whose value is the empty string", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        notes: [{ value: "" }, { value: "real note" }],
        emails: [{ value: "" }, { value: "a@b.co" }],
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("NOTE:real note");
      expect(output).not.toContain("NOTE:\r\n");
      expect(output).toContain("EMAIL:a@b.co");
      expect(output).not.toContain("EMAIL:\r\n");
    });
  });

  describe("very long data and multi-fold scenarios", () => {
    it("folds a single value across many continuation lines", () => {
      const sut = new Formatter();
      // 300 x's → "NOTE:" + 300 chars = 305 octets. Expect 5 segments: 75,75,75,75,5.
      const note = "x".repeat(300);
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        notes: [{ value: note }],
      });
      const output = sut.format(vcard.toJSON());
      const lines = output.split("\r\n");
      const noteIdx = lines.findIndex((l) => l.startsWith("NOTE:"));
      // Collect the NOTE line plus all continuation lines (those starting with " ").
      let count = 1;
      while (
        noteIdx + count < lines.length &&
        lines[noteIdx + count].startsWith(" ")
      ) {
        count++;
      }
      expect(count).toBeGreaterThanOrEqual(4);
      // Each non-final folded segment is exactly 75 octets, plus 1 leading space
      // on continuation lines.
      for (let i = noteIdx; i < noteIdx + count - 1; i++) {
        const line = lines[i];
        expect(Buffer.byteLength(line, "utf8")).toEqual(
          i === noteIdx ? 75 : 76
        );
      }
      const unfolded = output.replace(/\r\n /g, "");
      expect(unfolded).toContain("NOTE:" + note);
    });

    it("folds a very long PHOTO data URI safely", () => {
      const sut = new Formatter();
      const base64 = "A".repeat(500);
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        photos: [
          {
            value: `data:image/jpeg;base64,${base64}`,
            params: { type: "image/jpeg", encoding: "b" },
          },
        ],
      });
      const output = sut.format(vcard.toJSON());
      const unfolded = output.replace(/\r\n /g, "");
      // Inside the value, ";" and "," are escaped.
      expect(unfolded).toContain(
        `PHOTO;TYPE=image/jpeg;ENCODING=b:data:image/jpeg\\;base64\\,${base64}`
      );
    });

    it("handles param strings long enough to require folding", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: {
          fullNames: ["John"],
          params: { label: "x".repeat(120) },
        },
      });
      const output = sut.format(vcard.toJSON());
      // The FN line, including the very long label, must fold and still
      // reconstruct to the original logical line.
      const unfolded = output.replace(/\r\n /g, "");
      expect(unfolded).toContain(`FN;LABEL=${"x".repeat(120)}:John`);
    });
  });

  describe("edge cases", () => {
    it("formats correctly when only honorificsPre is set (FN derived from prefix only)", () => {
      const sut = new Formatter();
      const vcard = new VCard({ name: { honorificsPre: ["Dr."] } });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("FN:Dr.");
      expect(output).toContain("N:;;;Dr.;");
    });

    it("ignores undefined / null entries in single-valued property arrays", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        // Cast to bypass the type system; user input could include nulls.
        emails: [{ value: "a@b.co" }, undefined, null, { value: "" }, { value: "c@d.co" }] as never,
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("EMAIL:a@b.co");
      expect(output).toContain("EMAIL:c@d.co");
      expect((output.match(/EMAIL:/g) ?? []).length).toEqual(2);
    });

    it("emits no PHOTO when photos array contains only empty entries", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        photos: [{}, { value: "" }],
      });
      const output = sut.format(vcard.toJSON());
      expect(output).not.toContain("PHOTO");
    });

    it("emits no ADR when addresses are entirely blank", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        addresses: [
          { street: "", locality: "", region: "", postCode: "", country: "" },
          {},
        ],
      });
      const output = sut.format(vcard.toJSON());
      expect(output).not.toContain("ADR");
    });

    it("omits REV/UID when value is empty", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["John"] },
        revision: { value: "" },
        uid: { value: "" },
      });
      const output = sut.format(vcard.toJSON());
      expect(output).not.toContain("REV");
      expect(output).not.toContain("UID");
    });

    it("uses only the first fullName when multiple are set", () => {
      const sut = new Formatter();
      const vcard = new VCard({
        name: { fullNames: ["First Name", "Second Name", "Third Name"] },
      });
      const output = sut.format(vcard.toJSON());
      expect(output).toContain("FN:First Name");
      expect(output).not.toContain("FN:Second Name");
    });
  });
});
