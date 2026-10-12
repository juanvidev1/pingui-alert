// No hay .env en CI; se usa el admin chat id por defecto para los tests.
process.env.ADMIN_CHAT_ID ||= '1547430999';