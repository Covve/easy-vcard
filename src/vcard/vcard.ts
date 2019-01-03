import { cloneDeep } from "lodash";

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
  public uid: ISingleValueProperty = {}
   
  constructor(data?: IVCard) {
    if (!data) return;
    if (data.name)
      this.name = cloneDeep(data.name);
    if (data.addresses)
      this.addresses = cloneDeep(data.addresses);
    if (data.phones)
      this.phones = cloneDeep(data.phones);
    if (data.emails)
      this.emails = cloneDeep(data.emails);
    if (data.titles)
      this.titles = cloneDeep(data.titles);
    if (data.roles)
      this.roles = cloneDeep(data.roles);
    if (data.organizations)
      this.organizations = cloneDeep(data.organizations);
    if (data.notes)
      this.notes = cloneDeep(data.notes);
    if (data.revision)
      this.revision = cloneDeep(data.revision);
    if (data.uid)
      this.uid = cloneDeep(data.uid);
  }
}
