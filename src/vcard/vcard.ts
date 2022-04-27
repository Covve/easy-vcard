import { Formatter } from "../formatter/formatter";
import isEmpty = require("lodash.isempty");
import cloneDeep = require("lodash.clonedeep");

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
  encoding?: string;
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
  nicknames?: ISingleValueProperty[];
  photos?: ISingleValueProperty[];
  addresses?: IAddress[];
  phones?: ISingleValueProperty[];
  emails?: ISingleValueProperty[];
  titles?: ISingleValueProperty[];
  roles?: ISingleValueProperty[];
  organizations?: IMultiValueProperty[];
  notes?: ISingleValueProperty[];
  revision?: ISingleValueProperty;
  uid?: ISingleValueProperty;
  url?: ISingleValueProperty[];
}

const formatter = new Formatter();

export class VCard {
  private _name: IName = {};
  private _nicknames: ISingleValueProperty[] = [];
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
  private _url: ISingleValueProperty[] = [];

  constructor(data?: Partial<IVCard>) {
    if (!data) return;
    data = cloneDeep(data);
    this._name = data.name ?? {};
    this._nicknames = data.nicknames ?? [];
    this._photos = data.photos ?? [];
    this._addresses = data.addresses ?? [];
    this._phones = data.phones ?? [];
    this._emails = data.emails ?? [];
    this._titles = data.titles ?? [];
    this._roles = data.roles ?? [];
    this._organizations = data.organizations ?? [];
    this._notes = data.notes ?? [];
    this._revision = data.revision ?? {};
    this._uid = data.uid ?? {};
    this._url = data.url ?? [];
  }

  public toJSON(): IVCard {
    return cloneDeep({
      name: this._name,
      nicknames: this._nicknames,
      photos: this._photos,
      addresses: this._addresses,
      phones: this._phones,
      emails: this._emails,
      titles: this._titles,
      roles: this._roles,
      organizations: this._organizations,
      notes: this._notes,
      revision: this._revision,
      uid: this._uid,
      url: this._url,
    });
  }

  public toVcard(forceV3 = false): string {
    return formatter.format(this.toJSON(), forceV3);
  }

  public toString(forceV3 = false): string {
    return this.toVcard(forceV3);
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

  public addNickname(nickname: string, params?: IParams): VCard {
    this._nicknames = this._nicknames || [];
    this._nicknames.push({ value: nickname, params });
    return this;
  }

  public addPhoto(data: string, params?: IParams): VCard {
    this._photos.push({ value: data, params });
    return this;
  }

  public addAddress(
    street: string,
    locality: string,
    region: string,
    postCode: string,
    country: string,
    params?: IParams
  ): VCard {
    this._addresses = this._addresses || [];
    const address = { street, locality, region, postCode, country, params };
    if (!isEmpty(address)) this._addresses.push(address);
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

  public addOrganization(
    organization: string,
    organizationUnits: string[],
    params?: IParams
  ): VCard {
    let values =
      organizationUnits && organizationUnits.length
        ? organizationUnits.slice()
        : [];
    values.splice(0, 0, organization);

    this._organizations = this._organizations || [];
    this._organizations.push({ values, params });
    return this;
  }

  public addNotes(notes: string, params?: IParams): VCard {
    this._notes = this._notes || [];
    this._notes.push({ value: notes, params });
    return this;
  }

  public addUrl(url: string, params?: IParams): VCard {
    this._url = this._url || [];
    this._url.push({ value: url, params });
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
