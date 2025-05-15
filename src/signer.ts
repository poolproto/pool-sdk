import { createHash, createHmac } from 'crypto';
import { PlaceOrderParams } from './types.js';

export interface SignableOrder {
  asset: string;
  side: string;
  type: string;
  price: number;
  size: number;
  trader: string;
  nonce: number;
}

export function buildOrderMessage(order: SignableOrder): string {
  return [
    order.asset,
    order.side,
    order.type,
    order.price.toString(),
    order.size.toString(),
    order.trader,
    order.nonce.toString(),
  ].join(':');
}

export function hashOrder(order: SignableOrder): string {
  const message = buildOrderMessage(order);
  return createHash('sha256').update(message).digest('hex');
}

export function signOrder(order: SignableOrder, secret: string): string {
  const message = buildOrderMessage(order);
  return createHmac('sha256', secret).update(message).digest('hex');
}

export function verifyOrder(order: SignableOrder, signature: string, secret: string): boolean {
  const expected = signOrder(order, secret);
  return expected === signature;
}

export function buildSignedOrder(
  params: Omit<SignableOrder, 'nonce'>,
  secret: string
): PlaceOrderParams & { nonce: number } {
  const nonce = Date.now();
  const signable: SignableOrder = { ...params, nonce };
  const signature = signOrder(signable, secret);
  return { ...params, nonce, signature };
}
