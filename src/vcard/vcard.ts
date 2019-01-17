import isEmpty from 'lodash.isempty';
import cloneDeep from 'lodash.clonedeep';
import { Formatter } from '../formatter/formatter';

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
  name: IName;
  photos: ISingleValueProperty[];
  addresses: IAddress[];
  phones: ISingleValueProperty[];
  emails: ISingleValueProperty[];
  titles: ISingleValueProperty[];
  roles: ISingleValueProperty[];
  organizations: IMultiValueProperty[];
  notes: ISingleValueProperty[];
  revision: ISingleValueProperty;
  uid: ISingleValueProperty;
}

const formatter = new Formatter();

export class VCard {
  private _name: IName = {};
  private _photos: ISingleValueProperty[] = [];
  private _addresses: IAddress[] = [];
  private _phones: ISingleValueProperty[] = [];
  private _emails: ISingleValueProperty[] = [];
  private _titles: ISingleValueProperty[] = [];
  private _roles: ISingleValueProperty[] = [];
  private _organizations: IMultiValueProperty[] = [];
  private _notes: ISingleValueProperty[] = [];
  private _revision: ISingleValueProperty = {};
  private _uid: ISingleValueProperty = {};

  constructor(data?: Partial<IVCard>) {
    if (!data) return;
    data = cloneDeep(data);
    this._name = data.name || {};
    this._photos = data.photos || []
    this._addresses = data.addresses || [];
    this._phones = data.phones || [];
    this._emails = data.emails || [];
    this._titles = data.titles || [];
    this._roles = data.roles || [];
    this._organizations = data.organizations || [];
    this._notes = data.notes || [];
    this._revision = data.revision || {};
    this._uid = data.uid || {};
  }

  public toJSON() {
    return cloneDeep({
      name: this._name,
      addresses: this._addresses,
      phones: this._phones,
      emails: this._emails,
      titles: this._titles,
      roles: this._roles,
      organizations: this._organizations,
      notes: this._notes,
      revision: this._revision,
      uid: this._uid
    })
  }

  public toVcard(forceV3 = false): string {
    return formatter.format(this.toJSON(), forceV3);
  }

  public toString(forceV3 = false): string {
    return this.toVcard();
  }

  /** Helper methods for editing after initialization **/
  public addFirstName(firstName: string): VCard {
    this._name.firstNames = this._name.firstNames || [];
    this._name.firstNames.push(firstName);
    return this;
  }

  public addMiddleName(middleName: string): VCard {
    this._name.middleNames = this._name.middleNames || [];
    this._name.middleNames.push(middleName);
    return this;
  }

  public addLastName(lastName: string): VCard {
    this._name.lastNames = this._name.lastNames || [];
    this._name.lastNames.push(lastName);
    return this;
  }

  public addPrefixName(pre: string): VCard {
    this._name.honorificsPre = this._name.honorificsPre || [];
    this._name.honorificsPre.push(pre);
    return this;
  }

  public addSuffixName(suf: string): VCard {
    this._name.honorificsSuf = this._name.honorificsSuf || [];
    this._name.honorificsSuf.push(suf);
    return this;
  }

  public setFullName(fullname: string): VCard {
    this._name.fullNames = this._name.fullNames || [];
    this._name.fullNames.push(fullname);
    return this;
  }

  public addPhoto(uri: string, params?: IParams): VCard {
    this._photos.push({ value: uri, params });
    return this;
  }

  public addAddress(street: string, locality: string, region: string,
                    postCode: string, country: string, params?: IParams): VCard {
    this._addresses = this._addresses || [];
    const address = { street, locality, region, postCode, country, params };
    if (!isEmpty(address))
      this._addresses.push(address);
    return this;
  }

  public addPhone(number: string, params?: IParams): VCard {
    this._phones = this._phones || [];
    this._phones.push({ value: number, params });
    return this;
  }

  public addEmail(email: string, params?: IParams): VCard {
    this._emails = this._emails || [];
    this._emails.push({ value: email, params });
    return this;
  }

  public addTitle(title: string, params?: IParams): VCard {
    this._titles = this._titles || [];
    this._titles.push({ value: title, params });
    return this;
  }

  public addRole(role: string, params?: IParams): VCard {
    this._roles = this._roles || [];
    this._roles.push({ value: role, params });
    return this;
  }

  public addOrganization(organization: string, organizationUnits: string[], params?: IParams): VCard {
    let values = organizationUnits && organizationUnits.length ? organizationUnits.slice() : [];
    values.splice(0, 0, organization);

    this._organizations = this._organizations || [];
    this._organizations.push({ values , params });
    return this;
  }

  public addNotes(notes: string, params?: IParams): VCard {
    this._notes = this._notes || [];
    this._notes.push({ value: notes, params });
    return this;
  }

  public setRevision(rev: string, params?: IParams): VCard {
    this._revision = { value: rev, params };
    return this;
  }

  public setUID(uid: string, params?: IParams): VCard {
    this._uid = { value: uid, params };
    return this;
  }
}
