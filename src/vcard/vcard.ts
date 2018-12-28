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

export interface IPhone {
  number?: string;
  params?: IParams;
}

export interface IVCard {
  name?: IName;
  addresses?: IAddress[];
  phones?: IPhone[];
}

export class VCard implements IVCard {
  public name: IName = {};
  public addresses: IAddress[] = [];
  public phones: IPhone[] = [];
   
  constructor(data?: IVCard) {
    if(!data) return;
    if(data.name)
      this.name = cloneDeep(data.name);
    if(data.addresses)
      this.addresses = cloneDeep(data.addresses);
    if(data.phones)
      this.phones = cloneDeep(data.phones);
  }
}
