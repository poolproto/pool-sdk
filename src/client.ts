import {
  Order,
  Trade,
  OrderBookSnapshot,
  PlaceOrderParams,
  PlaceOrderResult,
} from './types.js';

export class PoolClient {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async placeOrder(params: PlaceOrderParams): Promise<PlaceOrderResult> {
    const res = await fetch(`${this.baseUrl}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`placeOrder failed: ${await res.text()}`);
    return res.json() as Promise<PlaceOrderResult>;
  }

  async cancelOrder(orderId: string): Promise<{ cancelled: boolean }> {
    const res = await fetch(`${this.baseUrl}/order/${orderId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`cancelOrder failed: ${await res.text()}`);
    return res.json() as Promise<{ cancelled: boolean }>;
  }

  async getOrder(orderId: string): Promise<Order> {
    const res = await fetch(`${this.baseUrl}/order/${orderId}`);
    if (!res.ok) throw new Error(`getOrder failed: ${await res.text()}`);
    return res.json() as Promise<Order>;
  }

  async getBook(asset: string): Promise<OrderBookSnapshot> {
    const res = await fetch(`${this.baseUrl}/book/${encodeURIComponent(asset)}`);
    if (!res.ok) throw new Error(`getBook failed: ${await res.text()}`);
    return res.json() as Promise<OrderBookSnapshot>;
  }

  async getTrades(asset: string): Promise<Trade[]> {
    const res = await fetch(`${this.baseUrl}/trades/${encodeURIComponent(asset)}`);
    if (!res.ok) throw new Error(`getTrades failed: ${await res.text()}`);
    return res.json() as Promise<Trade[]>;
  }
}
