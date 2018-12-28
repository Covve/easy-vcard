// TODO: line folding
// mandatory FN or empty

import { VCard, IParams } from "../vcard/vcard";
import { isEmpty } from "lodash";

const NEWLINE = '\r\n';
const BEGIN_TOKEN = 'BEGIN:VCARD';
const VERSION_TOKEN = 'VERSION:4.0';
const END_TOKEN = 'END:VCARD';

export class Formatter {

  /**
   * Glues together vcard fields into a string
   *
   * @param vCard - The VCard object to format
   * @returns Valid version 4 vcard string
   */
  public format(vCard: VCard): string {
    const lines = [
      BEGIN_TOKEN,
      VERSION_TOKEN,
      this.getFullName(vCard),
      this.getNameComponents(vCard),
      ...this.getAddresses(vCard),
      ...this.getPhones(vCard),
      END_TOKEN
    ];
    return lines
      .reduce((accumulator, current) => accumulator + current + (current && NEWLINE), '').trim();
  }

  /**
   * Adds the FN - formatted name entry. This property must
   * exist in a VCard.
   */
  private getFullName(vCard: VCard): string {
    let name = vCard.name;
    if(!name) return '';
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
  private getNameComponents(vCard: VCard): string {
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
   * Adds the ADR - address entry. Creates one for each address in vCard.phones field.
   */
  private getAddresses(vCard: VCard): string[] {
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
   * Adds the TEL - telephone entry. Creates one for each address in the vCard.phones field.
   */
  private getPhones(vCard: VCard): string[] {
    let phones = vCard.phones;
    if(!phones || !phones.length) return [];
    return phones
      .filter(phone => !!phone && !isEmpty(phone))
      .map((phone) => 
           'TEL' + this.getFormattedParams(phone.params) + ':' + this.e(phone.number)
      );
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
}
