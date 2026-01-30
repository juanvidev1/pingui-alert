# Arquitectura Técnica - Pingui Alert

## Visión General del Sistema

Pingui Alert implementa una arquitectura de microservicios ligera con los siguientes componentes:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Cliente   │───▶│  API REST   │───▶│ Cola Redis  │───▶│   Worker    │
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

## Componentes Detallados

### 1. API REST (Hono.js)

**Endpoints principales:**
- `POST /api/alert` - Recibe y encola alertas
- `POST /api/createIntegration` - Crea nuevas integraciones
- `GET /api/integrations/:chatId` - Consulta integraciones
- `POST /api/revokeIntegration` - Revoca integraciones

**Middlewares:**
- `verifyJwtToken` - Autenticación JWT
- `validateRateLimit` - Control de límites de uso
- `validateStatus` - Verificación de estado de integración

### 2. Sistema de Colas (Redis)

**Configuración:**
```typescript
const QUEUE_KEY = 'pingui:queue:alerts';
const LOCK_KEY = 'pingui:queue:processing';
const MAX_QUEUE_SIZE = 500;
const SEND_DELAY_MS = 1000;
```

**Flujo de procesamiento:**
1. **Enqueue**: `LPUSH` a la cola Redis
2. **Lock**: Adquiere lock distribuido para evitar concurrencia
3. **Dequeue**: `LPOP` de la cola
4. **Process**: Envía mensaje a Telegram
5. **Release**: Libera lock y espera delay

### 3. Worker de Cola

**Características:**
- **Single Consumer**: Un worker por instancia
- **Rate Limiting**: 1 mensaje/segundo (Telegram limits)
- **Error Handling**: Best-effort, no retry automático
- **Logging**: Registro detallado de procesamiento

**Algoritmo:**
```typescript
while (true) {
  // 1. Adquirir lock
  const lock = await redis.set(LOCK_KEY, '1', { NX: true, PX: 10000 });
  
  // 2. Procesar mensaje si hay lock
  if (lock) {
    const job = await redis.lPop(QUEUE_KEY);
    if (job) {
      await sendToTelegram(job);
    }
    await redis.del(LOCK_KEY);
  }
  
  // 3. Esperar antes del siguiente ciclo
  await sleep(SEND_DELAY_MS);
}
```

### 4. Jobs Programados (node-cron)

#### Reset Rate Limits
- **Schedule**: `0 0 * * *` (medianoche diaria)
- **Función**: Reinicia `rateLimit` a 10 para todas las integraciones
- **Query**: `UPDATE Integrations SET rateLimit = 10`

#### Backup Database
- **Schedule**: `0 3 * * *` (3 AM diaria)
- **Función**: Copia archivo SQLite con timestamp
- **Ubicación**: `./backups/pingui/pingui-backup-{timestamp}.db`

### 5. Base de Datos (SQLite)

**Modelo Integration:**
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

## Patrones de Diseño Implementados

### 1. **Producer-Consumer Pattern**
- API actúa como Producer
- Worker actúa como Consumer
- Redis como Message Broker

### 2. **Circuit Breaker Pattern**
- Rate limiting previene sobrecarga
- Queue size limit previene memory overflow

### 3. **Retry Pattern**
- Implementado a nivel de aplicación
- Best-effort delivery sin retry automático

### 4. **Observer Pattern**
- Logging centralizado para todos los eventos
- Separación de concerns entre componentes

## Consideraciones de Rendimiento

### Throughput
- **Máximo teórico**: 86,400 mensajes/día (1 msg/seg × 24h)
- **Límite de cola**: 500 mensajes pendientes
- **Límite por usuario**: 10 mensajes/día

### Latencia
- **API Response**: < 50ms (solo enqueue)
- **End-to-end**: 1-500 segundos (dependiendo de posición en cola)

### Escalabilidad
- **Horizontal**: Múltiples workers con Redis compartido
- **Vertical**: Aumentar SEND_DELAY_MS para mayor throughput
- **Storage**: SQLite → PostgreSQL para mayor concurrencia

## Monitoreo y Observabilidad

### Métricas Clave
- Queue size (`LLEN pingui:queue:alerts`)
- Processing rate (mensajes/minuto)
- Error rate (fallos de envío)
- Rate limit hits por usuario

### Logs Estructurados
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

## Seguridad

### Autenticación
- JWT tokens con scope-based permissions
- Temporal tokens para setup inicial

### Rate Limiting
- 10 mensajes/día por integración
- Queue size limit global

### Data Protection
- Chat IDs hasheados en logs
- No almacenamiento de contenido de mensajes
- Tokens JWT con expiración

## Deployment

### Dependencias de Runtime
- Node.js v20+
- Redis server
- SQLite (incluido)

### Variables de Entorno Críticas
```env
BOT_TOKEN=telegram_bot_token
JWT_SECRET=jwt_signing_key
REDIS_URL=redis://localhost:6379
```

### Proceso de Inicio
1. Inicializar base de datos
2. Conectar a Redis
3. Iniciar worker de cola
4. Programar jobs
5. Iniciar bot de Telegram
6. Iniciar servidor HTTP