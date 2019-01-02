import { Formatter } from "./formatter";
import { VCard } from "../vcard/vcard";

describe('Formatter', () => {
  it('prints a VCard with fullName', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name.fullNames = ['John K. Doe'];
    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John K. Doe\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with both fullName and name components', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = { 
      fullNames: ['John K. Doe'],
      firstNames: ['John'],
      middleNames: ['K.', 'M.'],
      lastNames: ['Doe', 'Smith'],
      honorificsPre: ['Dr.'],
      honorificsSuf: ['Esq.']
    };
    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John K. Doe\r\n' +
                                      'N:Doe,Smith;John;K.,M.;Dr.;Esq.\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with fullName from first name components if not provided', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      firstNames: ['John', 'Jack'],
      middleNames: ['K.', 'M.'],
      lastNames: ['Doe', 'Smith'],
      honorificsSuf: ['Esq.', 'Esq2.']
    };
    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John K. Doe Esq.\r\n' +
                                      'N:Doe,Smith;John,Jack;K.,M.;;Esq.,Esq2.\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with an address', () => { 
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.addresses = [{
      street: 'someStreet',
      locality: 'someLocality',
      region: 'someRegion',
      postCode: 'somePostCode',
      country: 'someCountry'
    }];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'ADR:;;someStreet;someLocality;someRegion;somePostCode;someCountry\r\n'+
                                      'END:VCARD');
  });

  it('formats a VCard with addresses in a more complicated scenario', () => { 
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.addresses = [
      {
        street: 'someStreet',
        locality: 'someLocality',
        region: 'someRegion',
        country: 'someCountry'
      },
      {
        street: 'otherStreet',
        region: 'otherRegion',
        params: { type: 'HOME'}
      },
      {}
    ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'ADR:;;someStreet;someLocality;someRegion;;someCountry\r\n' +
                                      'ADR;TYPE=HOME:;;otherStreet;;otherRegion;;\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with a phone', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.phones = [{
      value: '+10 012345',
      params: { value: 'text' }
    }];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'TEL;VALUE=text:+10 012345\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with phones in a more complicated scenario', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.phones = [
      {
        value: '+10 012345', params: { value: 'text', pref: '1', type: 'voice,home' }
      },
      {
        value: 'tel:+1-555-555-5555;ext=5555', params: { value: 'uri' }
      },
      {}
    ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'TEL;VALUE=text;PREF=1;TYPE="voice,home":+10 012345\r\n' +
                                      'TEL;VALUE=uri:tel:+1-555-555-5555;ext=5555\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard an email', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.emails = [{ value: 'jdoe@smithsonian.com', params: { type: 'work', pref: '1' } }];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'EMAIL;PREF=1;TYPE=work:jdoe@smithsonian.com\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with emails in a more complicated scenario', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.emails = [
      { value: 'jdoe@smithsoni\nan.com', params: { type: 'work', pref: '1' } },
      { value: 'jdo,e2@smith sonian.com', params: <any> { type: null } },
      {}
    ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'EMAIL;PREF=1;TYPE=work:jdoe@smithsoni\\nan.com\r\n' +
                                      'EMAIL:jdo\,e2@smith sonian.com\r\n' + 
                                      'END:VCARD');
  });

  it('formats a VCard with a job title', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.titles = [{ value: 'Chief Officer' } ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'TITLE:Chief Officer\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with titles in a more complicated scenario', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.titles = [
      { value: 'Chief, officer\n', params: { pid: '1' } },
      { value: 'Father of 3', params: {pid: '2', altId: '3'} },
      {}
    ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'TITLE;PID=1:Chief\, officer\\n\r\n' +
                                      'TITLE;ALTID=3;PID=2:Father of 3\r\n' + 
                                      'END:VCARD');
  });

  it('formats a VCard with a job role', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.roles = [{ value: 'Project leader' } ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'ROLE:Project leader\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with roles in a more complicated scenario', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.roles = [
      { value: 'Project, Lead;-er\n', params: { pid: '1' } },
      { value: '\n\nFounder', params: {pid: '2', altId: '3'} },
      {}
    ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'ROLE;PID=1:Project\, Lead\;-er\\n\r\n' +
                                      'ROLE;ALTID=3;PID=2:\\n\\nFounder\r\n' + 
                                      'END:VCARD');
  });

  it('formats a VCard with an organization', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.organizations = [{ values: ['Covve Ltd.'] } ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'ORG:Covve Ltd.\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with roles in a more complicated scenario', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.organizations = [
      { values: ['Covve Ltd.', 'North American Division\nUSA'] },
      { values: ['Greatworks', 'Lumber Company', 'Inc.\n'], params: { type: 'main' }},
      {}
    ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'ORG:Covve Ltd.;North American Division\\nUSA\r\n' +
                                      'ORG;TYPE=main:Greatworks;Lumber Company;Inc.\\n\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with a note entry', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.notes = [{ value: 'Something noted' } ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'NOTE:Something noted\r\n' +
                                      'END:VCARD');
  });

  it('formats a VCard with notes in a more complicated scenario', () => {
    let sut = new Formatter();
    let vcard = new VCard();

    vcard.name = {
      fullNames: ['John'],
    };
    vcard.notes = [
      { value: 'Something noted\nwith many\nlines, of text', params: { language: 'En' } },
      { value: '\nAnother note' },
      {}
    ];

    expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                      'VERSION:4.0\r\n' +
                                      'FN:John\r\n' +
                                      'NOTE;LANGUAGE=En:Something noted\\nwith many\\nlines\, of text\r\n' +
                                      'NOTE:\\nAnother note\r\n' + 
                                      'END:VCARD');
  });



  describe('params', () => {
    it('formats all params', () => {
      let sut = new Formatter();
      let vcard = new VCard();
      vcard.name = {
        fullNames: ['John'],
        params: {
          label: 'someLabel',
          language: 'someLanguage',
          value: 'someValue',
          pref: 'somePref',
          altId: 'someAltId',
          pid: 'somePid',
          type: 'someType',
          mediatype: 'someMediaType',
          calscale: 'someCalScale',
          sortAs: 'someSortAs',
          geo: 'someGeo',
          timezone: 'someTimeZone'
        }
      };

      const expectedParamString = ';LABEL=someLabel;LANGUAGE=someLanguage;VALUE=someValue;PREF=somePref;ALTID=someAltId;' +
                                  'PID=somePid;TYPE=someType;MEDIATYPE=someMediaType;CALSCALE=someCalScale;' +
                                  'SORT-AS=someSortAs;GEO=someGeo;TZ=someTimeZone';
      expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                        'VERSION:4.0\r\n' +
                                        'FN' + expectedParamString + ':John\r\n' +
                                        'END:VCARD');
    });

    it('sanitizes params', () => {
      let sut = new Formatter();
      let vcard = new VCard();
      vcard.name = {
        fullNames: ['John'],
        params: {
          label: 'some\nla\nbel',
          language: 'some:Language',
          value: '"someValue"',
          pref: 'some:Pref',
          altId: 'some,AltId',
          pid: 'somePid;',
          type: 'someType;;',
          mediatype: 'some:MediaType',
          calscale: 'someC,,alScale',
          sortAs: ',someSortAs',
          geo: ':someGeo',
          timezone: 'so:me"Ti"meZone'
        }
      };

      const expectedParamString = ';LABEL=some\\nla\\nbel;LANGUAGE="some:Language";VALUE=someValue;PREF="some:Pref";ALTID="some,AltId";' +
                                  'PID="somePid;";TYPE="someType;;";MEDIATYPE="some:MediaType";CALSCALE="someC,,alScale";' +
                                  'SORT-AS=",someSortAs";GEO=":someGeo";TZ="so:meTimeZone"';
      expect(sut.format(vcard)).toEqual('BEGIN:VCARD\r\n' +
                                        'VERSION:4.0\r\n' +
                                        'FN' + expectedParamString + ':John\r\n' +
                                        'END:VCARD');
    });
  });
});
