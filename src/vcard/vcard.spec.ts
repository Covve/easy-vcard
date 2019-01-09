import { VCard } from "./vcard";

describe('VCard', () => {
  it('initializes an empty VCard', () => {
    let sut = new VCard();
    expect(sut).toBeDefined();
    expect(sut.name).toEqual({});
  }); 

  it('initializes a VCard from data', () => {
    let data = {
      name: {
        firstNames: ['John'],
        middleNames: ['K.'],
        lastNames: ['Doe']
      }
    };
    let sut = new VCard(<any>data);
    expect(sut.name).toEqual(data.name);
  });

  it('sets fields on VCard', () => {
    let sut = new VCard();
    sut.name.firstNames = ['John'];
    sut.name.middleNames = ['K.'];
    sut.name.lastNames = ['Doe'];
    expect(sut.name).toEqual({
      firstNames: ['John'],
      middleNames: ['K.'],
      lastNames: ['Doe']
    });
  });

  describe('chaining methods', () => {
    it('sets a fullname', () => {
      let sut: any = new VCard();
      sut.setFullName('John Doe');
      expect(sut.name.fullNames.length).toEqual(1);
      expect(sut.name.fullNames[0]).toEqual('John Doe');
    });

    it('adds a first name', () => {
      let sut: any = new VCard();
      sut.addFirstName('John');
      expect(sut.name.firstNames.length).toEqual(1);
      expect(sut.name.firstNames[0]).toEqual('John');
    });

    it('adds a middle name', () => {
      let sut: any = new VCard();
      sut.addMiddleName('K.');
      expect(sut.name.middleNames.length).toEqual(1);
      expect(sut.name.middleNames[0]).toEqual('K.');
    });

    it('adds a last name', () => {
      let sut: any = new VCard();
      sut.addLastName('Doe');
      expect(sut.name.lastNames.length).toEqual(1);
      expect(sut.name.lastNames[0]).toEqual('Doe');
    });

    it('adds a name prefix', () => {
      let sut: any = new VCard();
      sut.addPrefixName('Dr.');
      expect(sut.name.honorificsPre.length).toEqual(1);
      expect(sut.name.honorificsPre[0]).toEqual('Dr.');
    });

    it('adds a name suffix', () => {
      let sut: any = new VCard();
      sut.addSuffixName('Esq.');
      expect(sut.name.honorificsSuf.length).toEqual(1);
      expect(sut.name.honorificsSuf[0]).toEqual('Esq.');
    });

    it('adds a full address', () => {
      let sut: any = new VCard();
      sut.addAddress(
        'someStreet',
        'someLocality',
        'someRegion',
        'somePostCode',
        'someCountry',
        { type: 'home' }
      );
      expect(sut.addresses.length).toEqual(1);
      expect(sut.addresses[0].street).toEqual('someStreet');
      expect(sut.addresses[0].locality).toEqual('someLocality');
      expect(sut.addresses[0].region).toEqual('someRegion');
      expect(sut.addresses[0].postCode).toEqual('somePostCode');
      expect(sut.addresses[0].country).toEqual('someCountry');
      expect(sut.addresses[0].params.type).toEqual('home');
    });

    it('adds an incomplete address', () => {
      let sut: any = new VCard();
      sut.addAddress(
        'someStreet',
        null,
        null,
        null,
        'someCountry'
      );
      expect(sut.addresses.length).toEqual(1);
      expect(sut.addresses[0].street).toEqual('someStreet');
      expect(sut.addresses[0].locality).toBeNull();
      expect(sut.addresses[0].region).toBeNull();
      expect(sut.addresses[0].postCode).toBeNull();
      expect(sut.addresses[0].country).toEqual('someCountry');
      expect(sut.addresses[0].params).toEqual(undefined);
    });

    it('adds a phone', () => {
      let sut = new VCard();
      sut.addPhone('123', { pref: '1' });
      expect(sut.phones.length).toEqual(1);
      expect(sut.phones[0].value).toEqual('123');
    });

    it('adds an email', () => {
      let sut = new VCard();
      sut.addEmail('jdoe@smithsonian.com', { pref: '1' });
      expect(sut.emails.length).toEqual(1);
      expect(sut.emails[0].value).toEqual('jdoe@smithsonian.com');
    });

    it('adds a title', () => {
      let sut = new VCard();
      sut.addTitle('Engineer');
      expect(sut.titles.length).toEqual(1);
      expect(sut.titles[0].value).toEqual('Engineer');
    });

    it('adds a role', () => {
      let sut = new VCard();
      sut.addRole('Manager');
      expect(sut.roles.length).toEqual(1);
      expect(sut.roles[0].value).toEqual('Manager');
    });

    it('adds an organization with divisions', () => {
      let sut: any = new VCard();
      sut.addOrganization('Covve', ['North America Div', 'US']);
      expect(sut.organizations.length).toEqual(1);
      expect(sut.organizations[0].values.length).toEqual(3);
      expect(sut.organizations[0].values).toEqual(['Covve', 'North America Div', 'US']);
    });

    it('adds an organization without divisions', () => {
      let sut:any = new VCard();
      sut.addOrganization('Covve', null);
      expect(sut.organizations.length).toEqual(1);
      expect(sut.organizations[0].values.length).toEqual(1);
      expect(sut.organizations[0].values).toEqual(['Covve']);
    });

    it('adds notes', () => {
      let sut = new VCard();
      sut.addNotes('some notes');
      expect(sut.notes.length).toEqual(1);
      expect(sut.notes[0].value).toEqual('some notes');
    });

    it('sets a revision', () => {
      let sut = new VCard();
      sut.setRevision('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
      expect(sut.revision.value).toEqual('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
    });

    it('adds a UID', () => {
      let sut = new VCard();
      sut.setUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
      expect(sut.uid.value).toEqual('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
    });
  });
});
