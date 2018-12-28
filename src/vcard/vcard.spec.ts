import { VCard } from "./vcard";

describe('VCard', () => {
  test('initializes an empty VCard', () => {
    let sut = new VCard();
    expect(sut).toBeDefined();
    expect(sut.name).toEqual({});
  }); 

  test('initializes a VCard from data', () => {
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

  test('sets fields on VCard', () => {
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
});
