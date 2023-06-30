import { collection } from "../configs/mongoConfig.js";
import { bot } from '../configs/botConfig.js';

export async function viewTasks(msg) {
    const chatId = msg.chat.id;
    try {
        const tasks = await collection.find({ id: chatId, task: { $exists: true } }).toArray();
        let tasksMsg = 'Ваши задачи:\n\n';;
        if (tasks.task === undefined) {
            tasksMsg = `У вас нету запланированных задач ${tasks[0].task}`;
        } else {
            tasks.forEach((task) => {
                    tasksMsg += `• ${task.task}\n`;});
        }       
        bot.sendMessage(chatId, tasksMsg);
    } catch (error) {
        bot.sendMessage(chatId, 'Ошибка при просмотре задач.');
    }
}