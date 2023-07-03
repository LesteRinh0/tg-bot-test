import { collection } from "../configs/mongoConfig.js";
import { bot } from '../configs/botConfig.js';
import { sendErrorMessage } from "../helpers/sendErrorMessage.js";

export async function viewTasks(msg) {
    const chatId = msg.chat.id;
    try {
        const tasks = await collection.find({ id: chatId, task: { $exists: true } }).toArray();
        let tasksMsg = 'Ваши задачи:\n\n';;
        if (tasks.length === 0) {
            tasksMsg = 'У вас нету запланированных задач';
        } else {
            tasks.forEach((task) => {
                    tasksMsg += `• ${task.task}\n`;});
        }       
        bot.sendMessage(chatId, tasksMsg);
    } catch (error) {
        sendErrorMessage(chatId, bot);
    }
}