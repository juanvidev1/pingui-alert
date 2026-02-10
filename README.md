# Pingui Alert Public

Pingui Alert is a lightweight notification service that allows you to send alerts to your Telegram account directly from your code. It's designed to be simple to use with zero configuration required on the client side.

![Pingui Alert](./src/public/images/mainImgWbg.png)

## System Architecture

Pingui Alert uses a queue-based architecture to ensure reliable alert delivery:

- **REST API**: Receives alerts and enqueues them
- **Redis Queue**: Stores pending alerts for delivery
- **Queue Worker**: Processes alerts and sends them to Telegram
- **Scheduled Jobs**: Automatic maintenance tasks
- **Telegram Bot**: Interface for managing integrations

## Internal Operation

### Queue System

Pingui Alert uses **Redis** as a queue system to handle alerts asynchronously:

```
API Request → Validation → Redis Queue → Worker → Telegram
```

**Queue Characteristics:**
- **Maximum capacity**: 500 pending alerts
- **Send rate**: 1 message per second (Telegram safe limit)
- **Persistence**: Alerts are stored in Redis until processed
- **Distributed lock**: Prevents duplicate processing

### Automatic Jobs

The system executes scheduled tasks using **node-cron**:

#### 1. Rate Limit Reset (00:00 daily)
```typescript
// Resets daily alert counter to 10 for all users
cron.schedule('0 0 * * *', resetRateLimitJob);
```

#### 2. Database Backup (03:00 daily)
```typescript
// Creates a backup copy of the SQLite database
cron.schedule('0 3 * * *', backupDbJob);
```

### Alert Flow

1. **Reception**: API receives POST `/api/alert`
2. **Validation**: Verifies JWT, rate limits and integration status
3. **Enqueuing**: Alert is saved in Redis with unique ID
4. **Processing**: Worker takes alert from queue
5. **Sending**: Sent to Telegram with rate limiting
6. **Logging**: Result is logged

> **⚠️ Important:** Redis is **required** for Pingui Alert to function. The queue system depends on Redis to store and process alerts. Make sure you have Redis running before starting the application.

## Prerequisites

- **Node.js**: v20 or higher recommended.
- **pnpm**: v9 or higher (PackageManager specified in package.json is `pnpm@9.15.1`).
- **Redis**: A Redis server (local or hosted) is required for the public bot's queue system. Set the `REDIS_URL` environment variable (e.g., `redis://localhost:6379`).

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/juanvidev1/pingui-alert.git
cd pingui-alert_public
pnpm install
```

## Configuration

Create a `.env` file in the root directory based on the following template. Fill in your specific values.

**Required Environment Variables:**

```env
# Telegram Bot Token
BOT_TOKEN=your_telegram_bot_token_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_PUBLIC=your_jwt_public_here

# Service Limits
MAX_ALERTS=10

# Database Configuration
DB_DIALECT=sqlite
DB_STORAGE=./storage/pingui.db

# Mailgun Configuration (for email notifications)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_URL=https://api.mailgun.net/v3/your-domain.com/messages
NOTIFICATION_EMAIL=noreply@your-domain.com
MAILGUN_DOMAIN=your-domain.com
DEVELOP_EMAIL=developer@email.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Running the Application

### Development

Run the application in watch mode with `tsx`:

```bash
pnpm run dev
```

### Build

Compile the TypeScript code:

```bash
pnpm run build
```

### Production

Run the compiled code:

```bash
pnpm run start
```

## Database

The project uses SQLite by default. Ensure the `./storage` directory exists or is created by the application/ORM.

## Monitoring and Logs

Pingui Alert generates detailed logs for monitoring:

- **`logs/info.log`**: General events and processed alerts
- **`logs/error.log`**: Application errors and send failures
- **`logs/jobs.log`**: Scheduled job execution

### Useful Monitoring Commands

```bash
# View alerts in real time
tail -f logs/info.log | grep "Sending alert"

# Monitor errors
tail -f logs/error.log

# View job status
tail -f logs/jobs.log

# Check Redis queue size
redis-cli LLEN pingui:queue:alerts
```

## Production Configuration

### Additional Environment Variables

```env
# Queue and Workers
REDIS_URL=redis://localhost:6379
MAX_QUEUE_SIZE=500
SEND_DELAY_MS=1000

# Backups
BACKUP_ROUTE=./backups/pingui/

# Logs
LOG_LEVEL=info
```

### Scalability

To handle higher volume:

1. **Multiple Workers**: Run multiple worker instances
2. **Redis Cluster**: For high availability of the queue
3. **Load Balancer**: Distribute requests across multiple APIs
4. **Monitoring**: Use tools like Prometheus + Grafana

## The Commandments

To keep Pingui Alert useful and stable for everyone, we adhere to a strict set of rules.

1.  **Critical Use Only**: Use it only for critical alerts that must be corrected immediately.
2.  **Production Standards**: If sending errors, follow production best practices.
3.  **Self-Host for Customization**: For any customization, use the self-hosted option.
4.  **Actionable Alerts**: Ensure every alert is actionable.
5.  **No Data Leakage**: Never send sensitive user data (PII) or secrets.
6.  **Fail Safely**: Ensure alert failures do not crash your application.

## Use Cases

- **Critical Error Monitoring**: Payment gateway failures, 500 errors.
- **System Resource Monitoring**: Low disk space, high RAM usage.
- **Security Incidents**: Brute force attempts, suspicious activities.
- **Background Job Failures**: Backup failures, cron job errors.

## License

ISC
