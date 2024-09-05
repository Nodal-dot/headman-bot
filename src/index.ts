import {Bot, session} from 'grammy';
import {MyContext} from 'types/bot';
import * as dotenv from 'dotenv';
import {currentDate, ignoreOld, userExists} from 'middlewares';
import {initial} from 'bot/session';
import {startCommand, statusCommand} from 'commands';
import {conversations, createConversation} from '@grammyjs/conversations';
import {addMarkReason, addStudent, changeTime, newUser} from 'conversations';
import {callbacks} from 'bot/callbacks';
import {markAbsentMenu, removeStudentMenu, scheduleMenu} from 'keyboard';
import {I18n} from '@grammyjs/i18n';
import {hears} from 'bot/hears';

dotenv.config();
(async () => {
    const bot = new Bot<MyContext>(String(process.env.BOT_TOKEN));
    const i18n = new I18n<MyContext>({
        defaultLocale: 'ru',
        directory: 'locales',
    });
    await bot.api.setMyCommands([
        { command: 'start', description: 'Start the bot' },
        { command: 'status', description: 'Check bot' },
    ]);

    bot.use(session({ initial }));
    bot.use(i18n);
    bot.use(conversations());

    bot.use(markAbsentMenu);
    bot.use(removeStudentMenu);
    bot.use(scheduleMenu);

    bot.use(createConversation(addMarkReason, 'addMarkReason'));
    bot.use(createConversation(newUser, 'newUser'));
    bot.use(createConversation(addStudent, 'addStudent'));
    bot.use(createConversation(changeTime, 'changeTime'));

    bot.use(ignoreOld());
    bot.use(currentDate);
    bot.use(startCommand);
    bot.use(userExists);
    bot.use(callbacks);
    bot.use(hears);
    bot.use(statusCommand);

    bot.catch(err => {
        console.error(
            `Error while handling update ${err.ctx.update.update_id}:`,
        );
        console.error(err.error);
    });
    console.log('Bot started');
    await bot.start();
})();
