import { VCard } from "./vcard";

describe('VCard', () => {
  it('initializes an empty VCard', () => {
    let sut = new VCard();
    expect(sut).toBeDefined();
    expect(sut.toJSON().name).toEqual({});
  });

  it('initializes a VCard from data', () => {
    let data = {
      name: {
        firstNames: ['John'],
        middleNames: ['K.'],
        lastNames: ['Doe']
      }
    };
    let sut = new VCard(data);
    expect(sut.toJSON().name).toEqual(data.name);
  });


  describe('chaining methods', () => {
    it('sets a fullname', () => {
      let sut = new VCard();
      sut.setFullName('John Doe');
      const name = sut.toJSON().name;
      expect(name.fullNames).toBeDefined();
      expect(name.fullNames!.length).toEqual(1);
      expect(name.fullNames![0]).toEqual('John Doe');
    });

    it('adds a first name', () => {
      let sut = new VCard();
      sut.addFirstName('John');
      const name = sut.toJSON().name;
      expect(name.firstNames).toBeDefined();
      expect(name.firstNames!.length).toEqual(1);
      expect(name.firstNames![0]).toEqual('John');
    });

    it('adds a middle name', () => {
      let sut = new VCard();
      sut.addMiddleName('K.');
      const name = sut.toJSON().name;
      expect(name.middleNames).toBeDefined();
      expect(name.middleNames!.length).toEqual(1);
      expect(name.middleNames![0]).toEqual('K.');
    });

    it('adds a last name', () => {
      let sut = new VCard();
      sut.addLastName('Doe');
      const name = sut.toJSON().name;
      expect(name.lastNames).toBeDefined();
      expect(name.lastNames!.length).toEqual(1);
      expect(name.lastNames![0]).toEqual('Doe');
    });

    it('adds a name prefix', () => {
      let sut = new VCard();
      sut.addPrefixName('Dr.');
      const name = sut.toJSON().name;
      expect(name.honorificsPre).toBeDefined();
      expect(name.honorificsPre!.length).toEqual(1);
      expect(name.honorificsPre![0]).toEqual('Dr.');
    });

    it('adds a name suffix', () => {
      let sut = new VCard();
      sut.addSuffixName('Esq.');
      const name = sut.toJSON().name;
      expect(name.honorificsSuf).toBeDefined();
      expect(name.honorificsSuf!.length).toEqual(1);
      expect(name.honorificsSuf![0]).toEqual('Esq.');
    });

    it('adds a nickname', () => {
      let sut = new VCard();
      sut.addNickname('Jonny');
      const nicknames = sut.toJSON().nicknames || [];
      expect(nicknames.length).toEqual(1);
      expect(nicknames[0].value).toEqual('Jonny');
    });

    it('adds a photo', () => {
      let sut: any = new VCard();
      sut.addPhoto('http://www.example.com/pub/photos/jqpublic.gif');
      const photos = sut.toJSON().photos;
      expect(photos.length).toEqual(1);
      expect(photos[0].value).toEqual('http://www.example.com/pub/photos/jqpublic.gif');
    })

    it('adds a full address', () => {
      let sut = new VCard();
      sut.addAddress(
        'someStreet',
        'someLocality',
        'someRegion',
        'somePostCode',
        'someCountry',
        { type: 'home' }
      );
      const addresses = sut.toJSON().addresses || [];
      expect(addresses.length).toEqual(1);
      expect(addresses[0].street).toEqual('someStreet');
      expect(addresses[0].locality).toEqual('someLocality');
      expect(addresses[0].region).toEqual('someRegion');
      expect(addresses[0].postCode).toEqual('somePostCode');
      expect(addresses[0].country).toEqual('someCountry');
      expect(addresses[0].params!.type).toEqual('home');
    });

    it('adds an incomplete address', () => {
      let sut = new VCard();
      sut = sut.addAddress(
        'someStreet',
        '',
        '',
        '',
        'someCountry'
      );
      const addresses = sut.toJSON().addresses || [];
      expect(addresses.length).toEqual(1);
      expect(addresses[0].street).toEqual('someStreet');
      expect(addresses[0].locality).toEqual('');
      expect(addresses[0].region).toEqual('');
      expect(addresses[0].postCode).toEqual('');
      expect(addresses[0].country).toEqual('someCountry');
      expect(addresses[0].params).toEqual(undefined);
    });

    it('adds a phone', () => {
      let sut = new VCard();
      sut.addPhone('123', { pref: '1' });
      const phones = sut.toJSON().phones || [];
      expect(phones.length).toEqual(1);
      expect(phones[0].value).toEqual('123');
    });

    it('adds an email', () => {
      let sut = new VCard();
      sut.addEmail('jdoe@smithsonian.com', { pref: '1' });
      const emails = sut.toJSON().emails || [];
      expect(emails.length).toEqual(1);
      expect(emails[0].value).toEqual('jdoe@smithsonian.com');
    });

    it('adds a title', () => {
      let sut = new VCard();
      sut.addTitle('Engineer');
      const titles = sut.toJSON().titles || [];
      expect(titles.length).toEqual(1);
      expect(titles[0].value).toEqual('Engineer');
    });

    it('adds a role', () => {
      let sut = new VCard();
      sut.addRole('Manager');
      const roles = sut.toJSON().roles || [];
      expect(roles.length).toEqual(1);
      expect(roles[0].value).toEqual('Manager');
    });

    it('adds an organization with divisions', () => {
      let sut = new VCard();
      sut.addOrganization('Covve', ['North America Div', 'US']);
      const organizations = sut.toJSON().organizations || [];
      expect(organizations.length).toEqual(1);
      expect(organizations[0].values!.length).toEqual(3);
      expect(organizations[0].values).toEqual(['Covve', 'North America Div', 'US']);
    });

    it('adds an organization without divisions', () => {
      let sut: any = new VCard();
      sut.addOrganization('Covve', null);
      const organizations = sut.toJSON().organizations;
      expect(organizations.length).toEqual(1);
      expect(organizations[0].values.length).toEqual(1);
      expect(organizations[0].values).toEqual(['Covve']);
    });

    it('adds notes', () => {
      let sut = new VCard();
      sut.addNotes('some notes');
      const notes = sut.toJSON().notes || [];
      expect(notes.length).toEqual(1);
      expect(notes[0].value).toEqual('some notes');
    });

    it('sets a revision', () => {
      let sut = new VCard();
      sut.setRevision('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
      const rev = sut.toJSON().revision || {};
      expect(rev.value).toEqual('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
    });

    it('adds a UID', () => {
      let sut = new VCard();
      sut.setUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
      const uid = sut.toJSON().uid || {};
      expect(uid.value).toEqual('f81d4fae-7dec-11d0-a765-00a0c91e6bf6');
    });

    it('adds a url', () => {
      let sut = new VCard();
      sut.addUrl('https://www.test.com');
      const url = sut.toJSON().url || [];
      expect(url.length).toEqual(1);
      expect(url[0].value).toEqual('https://www.test.com');
    })
  });
});
