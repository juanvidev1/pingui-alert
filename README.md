# Pingui Alert Public

Pingui Alert is a lightweight notification service that allows you to send alerts to your Telegram account directly from your code. It's designed to be simple to use with zero configuration required on the client side.

![Pingui Alert](./src/public/images/mainImgWbg.png)

## System Architecture

Pingui Alert uses a queue-based architecture to ensure reliable alert delivery:

```
API Request → Validation → Redis Queue → Worker → Telegram
```

- **REST API**: Receives alerts and enqueues them
- **Redis Queue**: Stores pending alerts for delivery
- **Queue Worker**: Processes alerts and sends them to Telegram
- **Scheduled Jobs**: Automatic maintenance tasks
- **Telegram Bot**: Interface for managing integrations

> **⚠️ Important:** Redis is **required** for Pingui Alert to function. Make sure you have Redis running before starting the application.

## Prerequisites

- **Node.js**: v20 or higher
- **pnpm**: v9 or higher
- **Redis**: Required for the queue system. Set the `REDIS_URL` environment variable (e.g., `redis://localhost:6379`)

## Installation

```bash
git clone https://github.com/juanvidev1/pingui-alert.git
cd pingui-alert_public
pnpm install
```

## Configuration

Create a `.env` file based on the following template:

```env
# Telegram Bot Token
BOT_TOKEN=your_telegram_bot_token_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Database
DB_DIALECT=sqlite
DB_STORAGE=./storage/pingui.db

# Redis
REDIS_URL=redis://localhost:6379

# Service Limits
MAX_ALERTS=10
MAX_QUEUE_SIZE=500

# Mailgun (for email notifications)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your-domain.com
NOTIFICATION_EMAIL=noreply@your-domain.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Running the Application

```bash
# Development
pnpm run dev

# Build
pnpm run build

# Production
pnpm run start
```

## API Reference

Base URL: `https://pingui-alert.dev/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/alert` | JWT | Send an alert to your Telegram |
| `POST` | `/alert/members` | JWT | Send an alert to all integration members |
| `POST` | `/createIntegration` | Temporal Token | Create a new integration |
| `GET` | `/integrations/:chatId` | JWT | Get integration details |
| `POST` | `/revokeIntegration` | JWT | Revoke an integration |
| `GET` | `/integration-members` | JWT | Get members of an integration |
| `POST` | `/change-member-status` | JWT | Enable or disable a member |
| `GET` | `/metrics/daily` | — | Public daily metrics |
| `GET` | `/health` | — | Health check |

## Monitoring and Logs

- **`logs/info.log`**: General events and processed alerts
- **`logs/error.log`**: Application errors and send failures
- **`logs/jobs.log`**: Scheduled job execution

```bash
# View alerts in real time
tail -f logs/info.log

# Monitor errors
tail -f logs/error.log

# Check Redis queue size
redis-cli LLEN pingui:queue:alerts
```

## The Commandments

1. **Critical Use Only**: Use it only for critical alerts that must be corrected immediately.
2. **Production Standards**: If sending errors, follow production best practices.
3. **Self-Host for Customization**: For any customization, use the self-hosted option.
4. **Actionable Alerts**: Ensure every alert is actionable.
5. **No Data Leakage**: Never send sensitive user data (PII) or secrets.
6. **Fail Safely**: Ensure alert failures do not crash your application.

## Use Cases

- **Critical Error Monitoring**: Payment gateway failures, 500 errors
- **System Resource Monitoring**: Low disk space, high RAM usage
- **Security Incidents**: Brute force attempts, suspicious activities
- **Background Job Failures**: Backup failures, cron job errors

## License

ISC
