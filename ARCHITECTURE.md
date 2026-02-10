# Technical Architecture - Pingui Alert

## System Overview

Pingui Alert implements a lightweight microservices architecture with the following components:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│  REST API   │───▶│ Redis Queue │───▶│   Worker    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                           │                                      │
                           ▼                                      ▼
                   ┌─────────────┐                        ┌─────────────┐
                   │  SQLite DB  │                        │  Telegram   │
                   └─────────────┘                        └─────────────┘
                           ▲
                           │
                   ┌─────────────┐
                   │    Jobs     │
                   └─────────────┘
```

## Detailed Components

### 1. REST API (Hono.js)

**Main endpoints:**
- `POST /api/alert` - Receives and enqueues alerts
- `POST /api/createIntegration` - Creates new integrations
- `GET /api/integrations/:chatId` - Queries integrations
- `POST /api/revokeIntegration` - Revokes integrations

**Middlewares:**
- `verifyJwtToken` - JWT authentication
- `validateRateLimit` - Usage limit control
- `validateStatus` - Integration status verification

### 2. Queue System (Redis)

**Configuration:**
```typescript
const QUEUE_KEY = 'pingui:queue:alerts';
const LOCK_KEY = 'pingui:queue:processing';
const MAX_QUEUE_SIZE = 500;
const SEND_DELAY_MS = 1000;
```

**Processing flow:**
1. **Enqueue**: `LPUSH` to Redis queue
2. **Lock**: Acquires distributed lock to avoid concurrency
3. **Dequeue**: `LPOP` from queue
4. **Process**: Sends message to Telegram
5. **Release**: Releases lock and waits delay

### 3. Queue Worker

**Features:**
- **Single Consumer**: One worker per instance
- **Rate Limiting**: 1 message/second (Telegram limits)
- **Error Handling**: Best-effort, no automatic retry
- **Logging**: Detailed processing logs

**Algorithm:**
```typescript
while (true) {
  // 1. Acquire lock
  const lock = await redis.set(LOCK_KEY, '1', { NX: true, PX: 10000 });
  
  // 2. Process message if lock acquired
  if (lock) {
    const job = await redis.lPop(QUEUE_KEY);
    if (job) {
      await sendToTelegram(job);
    }
    await redis.del(LOCK_KEY);
  }
  
  // 3. Wait before next cycle
  await sleep(SEND_DELAY_MS);
}
```

### 4. Scheduled Jobs (node-cron)

#### Reset Rate Limits
- **Schedule**: `0 0 * * *` (daily midnight)
- **Function**: Resets `rateLimit` to 10 for all integrations
- **Query**: `UPDATE Integrations SET rateLimit = 10`

#### Backup Database
- **Schedule**: `0 3 * * *` (daily 3 AM)
- **Function**: Copies SQLite file with timestamp
- **Location**: `./backups/pingui/pingui-backup-{timestamp}.db`

### 5. Database (SQLite)

**Integration Model:**
```sql
CREATE TABLE Integrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chatId INTEGER NOT NULL,
  tokenHash STRING NOT NULL,
  scope STRING NOT NULL,
  rateLimit INTEGER NOT NULL,
  status ENUM('active', 'revoked', 'pending') DEFAULT 'pending',
  createdAt DATE NOT NULL,
  updatedAt DATE NOT NULL
);
```

## Implemented Design Patterns

### 1. **Producer-Consumer Pattern**
- API acts as Producer
- Worker acts as Consumer
- Redis as Message Broker

### 2. **Circuit Breaker Pattern**
- Rate limiting prevents overload
- Queue size limit prevents memory overflow

### 3. **Retry Pattern**
- Implemented at application level
- Best-effort delivery without automatic retry

### 4. **Observer Pattern**
- Centralized logging for all events
- Separation of concerns between components

## Performance Considerations

### Throughput
- **Theoretical maximum**: 86,400 messages/day (1 msg/sec × 24h)
- **Queue limit**: 500 pending messages
- **Per-user limit**: 10 messages/day

### Latency
- **API Response**: < 50ms (enqueue only)
- **End-to-end**: 1-500 seconds (depending on queue position)

### Scalability
- **Horizontal**: Multiple workers with shared Redis
- **Vertical**: Increase SEND_DELAY_MS for higher throughput
- **Storage**: SQLite → PostgreSQL for higher concurrency

## Monitoring and Observability

### Key Metrics
- Queue size (`LLEN pingui:queue:alerts`)
- Processing rate (messages/minute)
- Error rate (send failures)
- Rate limit hits per user

### Structured Logs
```typescript
Logger.infoLog({ 
  chatId: number, 
  message: string,
  timestamp: ISO8601,
  component: 'api|worker|job'
});
```

### Health Checks
- Redis connectivity
- Telegram API availability
- Database accessibility
- Queue processing status

## Security

### Authentication
- JWT tokens with scope-based permissions
- Temporal tokens for initial setup

### Rate Limiting
- 10 messages/day per integration
- Global queue size limit

### Data Protection
- Chat IDs hashed in logs
- No message content storage
- JWT tokens with expiration

## Deployment

### Runtime Dependencies
- Node.js v20+
- Redis server
- SQLite (included)

### Critical Environment Variables
```env
BOT_TOKEN=telegram_bot_token
JWT_SECRET=jwt_signing_key
REDIS_URL=redis://localhost:6379
```

### Startup Process
1. Initialize database
2. Connect to Redis
3. Start queue worker
4. Schedule jobs
5. Start Telegram bot
6. Start HTTP server
