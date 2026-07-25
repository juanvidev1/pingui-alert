export interface Integration {
  id: number;
  chatId: number | string;
  tokenHash: string;
  scope: string;
  rateLimit: number;
  status: 'active' | 'revoked' | 'pending';
  deliveryMode: string;
  createdAt: Date;
  updatedAt: Date;
}
