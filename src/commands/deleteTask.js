import { sendErrorMessage } from "../helpers/sendErrorMessage.js";
import { collection } from "../configs/mongoConfig.js";

export async function deleteTask(msg) {
    const chatId = msg.chat.id;

    const tasks = collection.find({ id: chatId, task: { $exists: true } }).toArray();

      if (tasks.length === 0) {
        bot.sendMessage(chatId, 'У вас нет запланированных задач');
        return;
      }

      const taskList = tasks.map((task, index) => `${index + 1}. ${task.name}`).join('\n');

      bot.sendMessage(chatId, 'Выберите задачу для удаления:\n' + taskList);

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
    };