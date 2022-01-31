// TODO: line folding

import { IName, IParams, ISingleValueProperty, IVCard } from '../vcard/vcard';
import isEmpty = require("lodash.isempty");

const NEWLINE = '\r\n';
const BEGIN_TOKEN = 'BEGIN:VCARD';
const VERSION_TOKEN_V4 = 'VERSION:4.0';
const VERSION_TOKEN_V3 = 'VERSION:3.0';
const END_TOKEN = 'END:VCARD';

export class Formatter {

  /**
   * Glues together vcard fields into a string
   *
   * @param vCard - The VCard object to format
   * @returns Valid version 4 vcard string
   */
  public format(vCard: IVCard, forceV3 = false): string {
    const lines = [
      BEGIN_TOKEN,
      forceV3 ? VERSION_TOKEN_V3 : VERSION_TOKEN_V4,
      this.getFullName(vCard),
      this.getNameComponents(vCard),
      ...this.getNicknames(vCard),
      ...this.getPhotos(vCard),
      ...this.getAddresses(vCard),
      ...this.getPhones(vCard),
      ...this.getEmails(vCard),
      ...this.getTitles(vCard),
      ...this.getRoles(vCard),
      ...this.getOrganizations(vCard),
      ...this.getNotes(vCard),
      ...this.getUrl(vCard),
      this.getRevision(vCard),
      this.getUID(vCard),
      END_TOKEN
    ];
    return lines
      .reduce((accumulator, current) => accumulator + current + (current && NEWLINE), '').trim();
  }

  /**
   * Adds the FN - formatted name entry. This property must
   * exist in a VCard.
   */
  private getFullName(vCard: IVCard): string {
    let name = vCard.name;
    if(!name || this.checkIfNameExists(name))
      throw new Error('tried to format a vcard that had no name entry while name is mandatory');
    if (name.fullNames && name.fullNames.length)
      return 'FN' + this.getFormattedParams(name.params) + ':' + this.e(name.fullNames[0]);
    else if(name) {
      // construct from fields
      // TODO: rewrite this it looks terrible
      return 'FN:' + this.e(
        ((name.honorificsPre && !!name.honorificsPre.length) ? name.honorificsPre[0] + ' ' : '' ) +
        ((name.firstNames && !!name.firstNames.length) ? name.firstNames[0] + ' ' : '' ) +
        ((name.middleNames && !!name.middleNames.length) ? name.middleNames[0] + ' ' : '' ) +
        ((name.lastNames && !!name.lastNames.length) ? name.lastNames[0] + ' ' : '' ) +
        ((name.honorificsSuf && !!name.honorificsSuf.length) ? name.honorificsSuf[0] + ' ' : '' )
      ).trim();
    } else
      return '';
  }

  /**
   * Adds the N - name components entry. This is optional.
   */
  private getNameComponents(vCard: IVCard): string {
    let name = vCard.name;
    if(!name) return '';
    const components = [
      this.concatWith(name.lastNames),
      this.concatWith(name.firstNames),
      this.concatWith(name.middleNames),
      this.concatWith(name.honorificsPre),
      this.concatWith(name.honorificsSuf)
    ];
    if(components.every(c => c === '')) return '';
    let result = components.reduce((accumulator, current, index) => accumulator + current + (index !== 4 ? ';' : ''), '');
    return 'N:' + result;
  }

  /**
   * Adds the NICKNAME componeents entry. This is optional.
   */
  private getNicknames(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.nicknames, 'NICKNAME');
  }

  /**
   * Adds the PHOTO - photo entry. Creates on for each photo in vCard.photos field.
   */
  private getPhotos(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.photos, 'PHOTO');
  }

  /**
   * Adds the ADR - address entry. Creates one for each address in vCard.phones field.
   */
  private getAddresses(vCard: IVCard): string[] {
    let addresses = vCard.addresses;
    if(!addresses || !addresses.length) return [];
    return addresses
      .filter(addr => !!addr && !isEmpty(addr))
      .map((addr) =>
         'ADR' + this.getFormattedParams(addr.params) + ':;;' +
          this.e(addr.street) + ';' + this.e(addr.locality) + ';' +
          this.e(addr.region) + ';' + this.e(addr.postCode) + ';' +
          this.e(addr.country)
      );
  }

  /**
   * Adds the TEL - telephone entry. Creates one for each phone in the vCard.phones field.
   */
  private getPhones(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.phones, 'TEL');
  }

  /**
   * Adds the EMAIL - email entry. Creates one for each email in the vCard.emails field.
   */
  private getEmails(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.emails, 'EMAIL');
  }

  /**
   * Add the TITLE - job title entry. Creates one for each title in the vCard.titles field.
   */
  private getTitles(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.titles, 'TITLE');
  }

  /**
   * Add the ROLE - job role entry. Creates one for each role in the vCard.roles field.
   */
  private getRoles(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.roles, 'ROLE');
  }

  /**
   * Add the ORG - organization entry. Creates one for each organization in vCard.organizations
   */
  private getOrganizations(vCard: IVCard): string[] {
    const orgs = vCard.organizations;
    if(!orgs || !orgs.length) return [];
    return orgs
      .filter(org => !!org && !!org.values && !!org.values.length)
      .map((org: any) => 'ORG' + this.getFormattedParams(org.params) + ':' + org.values.map((v: string) => this.e(v)).join(';'));
  }

  /**
   * Add the NOTE - note entry. Creates one for each note in vCard.notes
   */
  private getNotes(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.notes, 'NOTE');
  }

  /**
   * Add the REV - revision entry. Creates at most one entry.
   */
  private getRevision(vCard: IVCard): string {
    const rev = vCard.revision;
    if(!rev || !rev.value) return '';
    return 'REV' + this.getFormattedParams(rev.params) + ':' + this.e(rev.value);
  }

  /**
   * Add the UID - user id entry. Creates at most one entry.
   */
  private getUID(vCard: IVCard): string {
    const uid = vCard.uid;
    if(!uid || !uid.value) return '';
    return 'UID' + this.getFormattedParams(uid.params) + ':' + this.e(uid.value);
  }

  /**
   * Add a URL - uniform resource locator entry. Creates one for each note in vCard.url
   */
  private getUrl(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.url, 'URL');
  }

  /**
   * Escape non valid characters according to RFC.
   * Those characters are comma, semicolon, backslash and newlines.
   *
   */
  private e(s: string | undefined): string {
    if(!s) return '';
    const escapedBackslashes = s.split('\\').join('\\\\');
    const escapedCommas = escapedBackslashes.split(',').join('\,');
    const escapedSemicolons = escapedCommas.split(';').join('\;');
    const escapedNewlines = escapedSemicolons.split('\n').join('\\n');
    return escapedNewlines;
  }

  /**
   * Concatenate list using a separator. By default comma.
   *
   * @param list - list to concat
   * @param separator - separator to concat with
   * @return concatenated list
   */
  private concatWith(list: any[] | undefined, separator = ','): string {
    if(!list || !list.length) return '';
    return list.reduce((accumulator, current) => accumulator + (accumulator? separator : '') + this.e(current), '');
  }

  /**
   * Format and concatenate parameters found in a property. Params are freetext so it's
   * up to the users to specify valid values
   *
   * @param params - parameter object
   * @return concatenated params
   */
  private getFormattedParams(params: IParams | undefined): string {
    if(!params) return '';
    let result = '';

    if(params.label) {
      result += `;LABEL=${this.sanitizeParamValue(params.label)}`;
    }
    if(params.language) {
      result += `;LANGUAGE=${this.sanitizeParamValue(params.language)}`;
    }
    if(params.value) {
      result += `;VALUE=${this.sanitizeParamValue(params.value)}`;
    }
    if(params.pref) {
      result += `;PREF=${this.sanitizeParamValue(params.pref)}`;
    }
    if(params.altId) {
      result += `;ALTID=${this.sanitizeParamValue(params.altId)}`;
    }
    if(params.pid) {
      result += `;PID=${this.sanitizeParamValue(params.pid)}`;
    }
    if(params.type) {
      result += `;TYPE=${this.sanitizeParamValue(params.type)}`;
    }
    if(params.mediatype) {
      result += `;MEDIATYPE=${this.sanitizeParamValue(params.mediatype)}`;
    }
    if(params.calscale) {
      result += `;CALSCALE=${this.sanitizeParamValue(params.calscale)}`;
    }
    if(params.sortAs) {
      result += `;SORT-AS=${this.sanitizeParamValue(params.sortAs)}`;
    }
    if(params.geo) {
      result += `;GEO=${this.sanitizeParamValue(params.geo)}`;
    }
    if(params.timezone) {
      result += `;TZ=${this.sanitizeParamValue(params.timezone)}`;
    }

    return result;
  }

  /**
   * Helper function to sanitize param value as indicated in the RFC6350.
   *
   * @param value - parameter value to sanitize
   */
  private sanitizeParamValue(value: string) {
    if(!value) return '';
    // remove all double quotes
    let result = value.split('"').join('');
    // escape newlines
    result = result.split('\n').join('\\n');
    // if colon, semicolon or comma appear on the string surround with double quotes
    if((result.indexOf(':') !== -1) || (result.indexOf(';') !== -1 ) || (result.indexOf(',') !== -1))
      return "\"" + result + "\"";
    return result;
  }

  private getSingleValuedProperty(entities: ISingleValueProperty[] | undefined, propertyIdentifier: string): string[] {
    if(!entities || !entities.length) return [];
    return entities
      .filter(entity => !!entity && entity.value)
      .map((entity) => propertyIdentifier + this.getFormattedParams(entity.params) + ':' + this.e(entity.value));
  }

  private checkIfNameExists(name: IName): boolean{
    return (!name ||
      (isEmpty(name.fullNames)
       && isEmpty(name.firstNames)
       && isEmpty(name.middleNames)
       && isEmpty(name.lastNames)
       && isEmpty(name.honorificsPre)
       && isEmpty(name.honorificsSuf)
      )
    );
  }
}
