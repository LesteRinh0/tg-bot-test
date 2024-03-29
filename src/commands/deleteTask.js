import { bot } from "../configs/botConfig.js";
import { collection } from "../configs/mongoConfig.js";

export async function deleteTask(msg) {
    const chatId = msg.chat.id;
  
    const tasks = await collection.find({ id: chatId, task: { $exists: true } }).toArray();
    let tasksMsg = '\n';
    if (tasks.length === 0) {
      tasksMsg = 'У вас нету запланированных задач';
      bot.sendMessage(chatId, tasksMsg);
    } else {
      tasks.forEach((task, index) => {
        tasksMsg += `${index + 1}. ${task.task}\n`;
      });
      bot.sendMessage(chatId, 'Выберите задачу для удаления:' + tasksMsg);
  
      bot.once('message', async (msg) => {
        const selectedTaskIndex = parseInt(msg.text) - 1;
  
        if (isNaN(selectedTaskIndex) || selectedTaskIndex < 0 || selectedTaskIndex >= tasks.length) {
          bot.sendMessage(chatId, 'Некорректный номер задачи. Попробуйте еще раз');
          return;
        }
  
        const selectedTask = tasks[selectedTaskIndex];
  
        await collection.deleteOne({ _id: selectedTask._id });
        bot.sendMessage(chatId, `Задача "${selectedTask.task}" успешно удалена`);
      });
    }
  }