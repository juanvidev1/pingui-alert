export class Mask {
  static email(email: string) {
    if (!email) return "";
    const [local, domain] = email.split("@");
    return `${local.slice(0, 3)}********@${domain}`;
  }

  static phone(phone: string) {
    if (!phone) return "";
    return phone.slice(0, 3) + "********" + phone.slice(-3);
  }

  static card(card: string) {
    if (!card) return "";
    return card.slice(0, 4) + "********" + card.slice(-4);
  }
}

