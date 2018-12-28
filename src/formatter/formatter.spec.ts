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
      number: '+10 012345',
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
        number: '+10 012345', params: { value: 'text', pref: '1', type: 'voice,home' }
      },
      {
        number: 'tel:+1-555-555-5555;ext=5555', params: { value: 'uri' }
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
