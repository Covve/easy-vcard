import { IAddress, IName, IParams, ISingleValueProperty, IVCard } from "../vcard/vcard";

const NEWLINE = "\r\n";
const BEGIN_TOKEN = "BEGIN:VCARD";
const VERSION_TOKEN_V4 = "VERSION:4.0";
const VERSION_TOKEN_V3 = "VERSION:3.0";
const END_TOKEN = "END:VCARD";
const MAX_LINE_OCTETS = 75;

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
      END_TOKEN,
    ];
    return lines
      .filter((line) => !!line)
      .map((line) => this.fold(line))
      .join(NEWLINE);
  }

  /**
   * Adds the FN - formatted name entry. This property must
   * exist in a VCard.
   */
  private getFullName(vCard: IVCard): string {
    const name = vCard.name;
    if (!name || this.checkIfNameExists(name))
      throw new Error(
        "tried to format a vcard that had no name entry while name is mandatory"
      );
    if (name.fullNames?.length)
      return (
        "FN" +
        this.getFormattedParams(name.params) +
        ":" +
        this.e(name.fullNames[0])
      );
    const segments = [
      name.honorificsPre?.[0],
      name.firstNames?.[0],
      name.middleNames?.[0],
      name.lastNames?.[0],
      name.honorificsSuf?.[0],
    ].filter((s): s is string => !!s);
    return "FN:" + this.e(segments.join(" "));
  }

  /**
   * Adds the N - name components entry. This is optional.
   */
  private getNameComponents(vCard: IVCard): string {
    const name = vCard.name;
    if (!name) return "";
    const components = [
      this.concatWith(name.lastNames),
      this.concatWith(name.firstNames),
      this.concatWith(name.middleNames),
      this.concatWith(name.honorificsPre),
      this.concatWith(name.honorificsSuf),
    ];
    if (components.every((c) => c === "")) return "";
    return "N:" + components.join(";");
  }

  /**
   * Adds the NICKNAME components entry. This is optional.
   */
  private getNicknames(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.nicknames, "NICKNAME");
  }

  /**
   * Adds the PHOTO - photo entry. Creates on for each photo in vCard.photos field.
   */
  private getPhotos(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.photos, "PHOTO");
  }

  /**
   * Adds the ADR - address entry. Creates one for each address in vCard.addresses field.
   */
  private getAddresses(vCard: IVCard): string[] {
    const addresses = vCard.addresses;
    if (!addresses?.length) return [];
    return addresses
      .filter((addr) => !!addr && this.hasAddressContent(addr))
      .map(
        (addr) =>
          "ADR" +
          this.getFormattedParams(addr.params) +
          ":;;" +
          this.e(addr.street) +
          ";" +
          this.e(addr.locality) +
          ";" +
          this.e(addr.region) +
          ";" +
          this.e(addr.postCode) +
          ";" +
          this.e(addr.country)
      );
  }

  /**
   * Adds the TEL - telephone entry. Creates one for each phone in the vCard.phones field.
   */
  private getPhones(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.phones, "TEL");
  }

  /**
   * Adds the EMAIL - email entry. Creates one for each email in the vCard.emails field.
   */
  private getEmails(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.emails, "EMAIL");
  }

  /**
   * Add the TITLE - job title entry. Creates one for each title in the vCard.titles field.
   */
  private getTitles(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.titles, "TITLE");
  }

  /**
   * Add the ROLE - job role entry. Creates one for each role in the vCard.roles field.
   */
  private getRoles(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.roles, "ROLE");
  }

  /**
   * Add the ORG - organization entry. Creates one for each organization in vCard.organizations
   */
  private getOrganizations(vCard: IVCard): string[] {
    const orgs = vCard.organizations;
    if (!orgs?.length) return [];
    return orgs
      .filter((org) => !!org && !!org.values && !!org.values.length)
      .map(
        (org) =>
          "ORG" +
          this.getFormattedParams(org.params) +
          ":" +
          org.values?.map((v: string) => this.e(v)).join(";")
      );
  }

  /**
   * Add the NOTE - note entry. Creates one for each note in vCard.notes
   */
  private getNotes(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.notes, "NOTE");
  }

  /**
   * Add the REV - revision entry. Creates at most one entry.
   */
  private getRevision(vCard: IVCard): string {
    const rev = vCard.revision;
    if (!rev?.value) return "";
    return (
      "REV" + this.getFormattedParams(rev.params) + ":" + this.e(rev.value)
    );
  }

  /**
   * Add the UID - user id entry. Creates at most one entry.
   */
  private getUID(vCard: IVCard): string {
    const uid = vCard.uid;
    if (!uid?.value) return "";
    return (
      "UID" + this.getFormattedParams(uid.params) + ":" + this.e(uid.value)
    );
  }

  /**
   * Add a URL - uniform resource locator entry. Creates one for each note in vCard.url
   */
  private getUrl(vCard: IVCard): string[] {
    return this.getSingleValuedProperty(vCard.url, "URL");
  }

  /**
   * Escape characters in property text values per RFC6350 §3.4:
   * backslash, comma, semicolon, and newlines.
   */
  private e(s: string | undefined): string {
    if (!s) return "";
    return s
      .split("\\").join("\\\\")
      .split(",").join("\\,")
      .split(";").join("\\;")
      .split("\r\n").join("\\n")
      .split("\n").join("\\n");
  }

  /**
   * Concatenate list using a separator. By default comma.
   *
   * @param list - list to concat
   * @param separator - separator to concat with
   * @return concatenated list
   */
  private concatWith(list: string[] | undefined, separator = ","): string {
    if (!list?.length) return "";
    return list.map((item) => this.e(item)).join(separator);
  }

  /**
   * Format and concatenate parameters found in a property. Params are freetext so it's
   * up to the users to specify valid values
   *
   * @param params - parameter object
   * @return concatenated params
   */
  private getFormattedParams(params: IParams | undefined): string {
    if (!params) return "";
    const mappings: Array<[keyof IParams, string]> = [
      ["label", "LABEL"],
      ["language", "LANGUAGE"],
      ["value", "VALUE"],
      ["pref", "PREF"],
      ["altId", "ALTID"],
      ["pid", "PID"],
      ["type", "TYPE"],
      ["mediatype", "MEDIATYPE"],
      ["calscale", "CALSCALE"],
      ["sortAs", "SORT-AS"],
      ["geo", "GEO"],
      ["timezone", "TZ"],
      ["encoding", "ENCODING"],
    ];
    return mappings
      .filter(([key]) => !!params[key])
      .map(([key, token]) => `;${token}=${this.sanitizeParamValue(params[key] as string)}`)
      .join("");
  }

  /**
   * Helper function to sanitize param value as indicated in the RFC6350.
   *
   * @param value - parameter value to sanitize
   */
  private sanitizeParamValue(value: string): string {
    if (!value) return "";
    // remove all double quotes
    let result = value.split('"').join("");
    // escape newlines
    result = result.split("\n").join("\\n");
    // if colon, semicolon or comma appear on the string surround with double quotes
    if (
      result.indexOf(":") !== -1 ||
      result.indexOf(";") !== -1 ||
      result.indexOf(",") !== -1
    )
      return '"' + result + '"';
    return result;
  }

  private getSingleValuedProperty(
    entities: ISingleValueProperty[] | undefined,
    propertyIdentifier: string
  ): string[] {
    if (!entities?.length) return [];
    return entities
      .filter((entity) => !!entity && !!entity.value)
      .map(
        (entity) =>
          propertyIdentifier +
          this.getFormattedParams(entity.params) +
          ":" +
          this.e(entity.value)
      );
  }

  private checkIfNameExists(name: IName): boolean {
    if (!name) return true;
    return (
      !name.fullNames?.length &&
      !name.firstNames?.length &&
      !name.middleNames?.length &&
      !name.lastNames?.length &&
      !name.honorificsPre?.length &&
      !name.honorificsSuf?.length
    );
  }

  private hasAddressContent(addr: IAddress): boolean {
    return !!(
      addr.street ||
      addr.locality ||
      addr.region ||
      addr.postCode ||
      addr.country
    );
  }

  /**
   * Fold a content line per RFC6350 §3.2: lines longer than 75 octets are
   * split with CRLF followed by a single SPACE. Splits are performed on
   * codepoint boundaries so multibyte UTF-8 characters are not torn.
   */
  private fold(line: string): string {
    if (!line) return line;
    const segments: string[] = [];
    let segmentBytes = 0;
    let segmentStart = 0;
    let i = 0;
    while (i < line.length) {
      const codePoint = line.codePointAt(i);
      if (codePoint === undefined) break;
      const charLen = codePoint > 0xffff ? 2 : 1;
      const byteLen = this.utf8ByteLength(codePoint);
      if (segmentBytes + byteLen > MAX_LINE_OCTETS && segmentBytes > 0) {
        segments.push(line.slice(segmentStart, i));
        segmentStart = i;
        segmentBytes = 0;
      }
      segmentBytes += byteLen;
      i += charLen;
    }
    if (segmentStart < line.length) {
      segments.push(line.slice(segmentStart));
    }
    return segments.join(NEWLINE + " ");
  }

  private utf8ByteLength(codePoint: number): number {
    if (codePoint < 0x80) return 1;
    if (codePoint < 0x800) return 2;
    if (codePoint < 0x10000) return 3;
    return 4;
  }
}
