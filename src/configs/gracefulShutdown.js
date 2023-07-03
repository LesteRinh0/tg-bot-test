export function gracefulShutdown() {
  client.close(); // Закрываем подключение к базе данных
  server.close(); // Выключаем сервер
  process.exit(0); // Завершаем процесс
  }