import { bot } from "../configs/botConfig.js";
import { sendErrorMessage } from "../helpers/sendErrorMessage.js";
import { collection } from "../configs/mongoConfig.js";

export async function deleteTask(msg) {
    const chatId = msg.chat.id;

    const tasks = await collection.find({ id: chatId, task: { $exists: true } }).toArray();
        let tasksMsg = 'Ваши задачи:\n\n';;
        if (tasks.length === 0) {
            tasksMsg = 'У вас нету запланированных задач';
            bot.sendMessage(chatId, tasksMsg);
        } else {
            tasks.forEach((task) => {
                    tasksMsg += `• ${task.task}\n`;});
          bot.sendMessage(chatId, 'Выберите задачу для удаления:\n' + tasksMsg);

          bot.once('message', (msg) => {
          const selectedTaskIndex = parseInt(msg.text) - 1;

          if (isNaN(selectedTaskIndex) || selectedTaskIndex < 0 || selectedTaskIndex >= tasks.length) {
          bot.sendMessage(chatId, 'Некорректный номер задачи. Попробуйте еще раз');
          return;
          }

          const selectedTask = tasks[selectedTaskIndex];

          collection.deleteOne({ _id: selectedTask._id }, (err, result) => {
          if (err) {
            sendErrorMessage(chatId, bot);
          }

          bot.sendMessage(chatId, `Задача "${selectedTask.name}" успешно удалена`);
            });
          });
        }            
  };