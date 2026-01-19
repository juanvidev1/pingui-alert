# Pingui Alert Public

Pingui Alert is a lightweight notification service that allows you to send alerts to your Telegram account directly from your code. It's designed to be simple to use with zero configuration required on the client side.

## Prerequisites

- **Node.js**: v20 or higher recommended.
- **pnpm**: v9 or higher (PackageManager specified in package.json is `pnpm@9.15.1`).

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
