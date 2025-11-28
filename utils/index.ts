export class Mask {
  static email(email: string) {
    if (!email) return '';
    const [local, domain] = email.split('@');
    return `${local.slice(0, 3)}********@${domain}`;
  }

  static phone(phone: string) {
    if (!phone) return '';
    return phone.slice(0, 3) + '********' + phone.slice(-3);
  }

  static card(card: string) {
    if (!card) return '';
    return card.slice(0, 4) + '********' + card.slice(-4);
  }
}

import jwt from 'jsonwebtoken';

export class Token {
  static generateSecret(data: object, expiresIn: string = '60 days') {
    return jwt.sign(data, Deno.env.get('JWT_SECRET') || '', { expiresIn });
  }
}

export class Auth {
  static generateTempPassword(length: number = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tempPassword = '';
    for (let i = 0; i < length; i++) {
      tempPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return tempPassword;
  }
}
