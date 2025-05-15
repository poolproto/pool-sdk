# noir-sdk

TypeScript SDK for Noir Protocol.

Place orders, read the book, verify settlements.

## Install

```bash
npm install @noirprotocol/sdk
```

## Usage

```typescript
import { NoirClient, buildSignedOrder } from '@noirprotocol/sdk';

const client = new NoirClient('http://localhost:3000');

// Sign and place a limit buy
const signed = buildSignedOrder(
  { asset: 'AAPL/USD', side: 'buy', type: 'limit', price: 195.50, size: 100, trader: '0xabc' },
  process.env.TRADER_SECRET!
);

const { order, trades } = await client.placeOrder(signed);
console.log('placed:', order.id, '| trades:', trades.length);

// Read the book
const book = await client.getBook('AAPL/USD');
console.log('best bid:', book.bids[0]?.price);
console.log('best ask:', book.asks[0]?.price);

// Cancel
await client.cancelOrder(order.id);
```

## API

### `NoirClient`

| Method | Returns | Description |
|---|---|---|
| `placeOrder(params)` | `PlaceOrderResult` | Place a limit or market order |
| `cancelOrder(id)` | `{ cancelled: boolean }` | Cancel an open order |
| `getOrder(id)` | `Order` | Fetch order by ID |
| `getBook(asset)` | `OrderBookSnapshot` | Current bids and asks |
| `getTrades(asset)` | `Trade[]` | Trade history for an asset |

### Signing

```typescript
import { signOrder, verifyOrder } from '@noirprotocol/sdk';

const sig = signOrder({ asset, side, type, price, size, trader, nonce }, secret);
const valid = verifyOrder({ asset, side, type, price, size, trader, nonce }, sig, secret);
```

## License

MIT
