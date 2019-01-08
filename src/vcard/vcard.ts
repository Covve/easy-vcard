import { cloneDeep, isEmpty } from "lodash";

export interface IParams {
  label?: string;
  language?: string;
  value?: string;
  pref?: string;
  altId?: string;
  pid?: string;
  type?: string;
  mediatype?: string;
  calscale?: string;
  sortAs?: string;
  geo?: string;
  timezone?: string;
}

export interface IName {
  fullNames?: string[];
  firstNames?: string[];
  middleNames?: string[];
  lastNames?: string[];
  honorificsPre?: string[];
  honorificsSuf?: string[];
  params?: IParams;
}

export interface IAddress {
  // POBox and extended-address are intentionally omitted as
  // advised in the RFC6350
  street?: string;
  locality?: string;
  region?: string;
  postCode?: string;
  country?: string;
  params?: IParams;
}

export interface ISingleValueProperty {
  value?: string;
  params?: IParams;
}

export interface IMultiValueProperty {
  values?: string[];
  params?: IParams;
}

export interface IVCard {
  name?: IName;
  addresses?: IAddress[];
  phones?: ISingleValueProperty[];
  emails?: ISingleValueProperty[];
  titles?: ISingleValueProperty[];
  roles?: ISingleValueProperty[];
  organizations?: IMultiValueProperty[];
  notes?: ISingleValueProperty[];
  revision?: ISingleValueProperty;
  uid?: ISingleValueProperty;
}

export class VCard implements IVCard {
  public name: IName = {};
  public addresses: IAddress[] = [];
  public phones: ISingleValueProperty[] = [];
  public emails: ISingleValueProperty[] = [];
  public titles: ISingleValueProperty[] = [];
  public roles: ISingleValueProperty[] = [];
  public organizations: IMultiValueProperty[] = [];
  public notes: ISingleValueProperty[] = [];
  public revision: ISingleValueProperty = {};
  public uid: ISingleValueProperty = {};
 
  constructor(data?: IVCard) {
    if (!data) return;
    this.name = data.name || {};
    this.addresses = cloneDeep(data.addresses) || [];
    this.phones = cloneDeep(data.phones) || [];
    this.emails = cloneDeep(data.emails) || [];
    this.titles = cloneDeep(data.titles) || [];
    this.roles = cloneDeep(data.roles) || [];
    this.organizations = cloneDeep(data.organizations) || [];
    this.notes = cloneDeep(data.notes) || [];
    this.revision = cloneDeep(data.revision) || {};
    this.uid = cloneDeep(data.uid) || {};
  }

  public addFirstName(firstName: string): VCard {
    if(!this.name.firstNames)
      this.name.firstNames = [];
    this.name.firstNames.push(firstName);
    return this;
  }

  public addMiddleName(middleName: string): VCard {
    if(!this.name.middleNames)
      this.name.middleNames = [];
    this.name.middleNames.push(middleName);
    return this;
  }

  public addLastName(lastName: string): VCard {
    if(!this.name.lastNames)
      this.name.lastNames = [];
    this.name.lastNames.push(lastName);
    return this;
  }

  public addPrefixName(pre: string): VCard {
    if(!this.name.honorificsPre)
      this.name.honorificsPre = [];
    this.name.honorificsPre.push(pre);
    return this;
  }

  public addSuffixName(suf: string): VCard {
    if(!this.name.honorificsSuf)
      this.name.honorificsSuf = [];
    this.name.honorificsSuf.push(suf);
    return this;
  }

  public setFullName(fullname: string): VCard {
    if(!this.name.fullNames)
      this.name.fullNames = [];
    this.name.fullNames.push(fullname);
    return this;
  }

  public addAddress(street: string, locality: string, region: string,
                    postCode: string, country: string, params?: IParams): VCard {
    const address = { street, locality, region, postCode, country, params };
    if (!isEmpty(address)) 
      this.addresses.push(address);
    return this;
  }

  public addPhone(number: string, params?: IParams): VCard {
    this.phones.push({ value: number, params });
    return this;
  }

  public addEmail(email: string, params?: IParams): VCard {
    this.emails.push({ value: email, params });
    return this;
  }

  public addTitle(title: string, params?: IParams): VCard {
    this.titles.push({ value: title, params });
    return this;
  }

  public addRole(role: string, params?: IParams): VCard {
    this.roles.push({ value: role, params });
    return this;
  }

  public addOrganization(organization: string, organizationUnits: string[], params?: IParams): VCard {
    let values = organizationUnits.slice();
    values.splice(0, 0, organization);
    this.organizations.push({ values , params });
    return this;
  }

  public addNotes(notes: string, params?: IParams): VCard {
    this.notes.push({ value: notes, params });
    return this;
  }

  public setRevision(rev: string, params?: IParams): VCard {
    this.revision = { value: rev, params };
    return this;
  }

  public setUID(uid: string, params?: IParams): VCard {
    this.uid = { value: uid, params };
    return this;
  }
}
