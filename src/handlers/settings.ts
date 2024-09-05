import {MyContext} from 'types/bot';
import {settingsKeyboard} from 'keyboard/custom/settings';

export const settingsHandler = (ctx: MyContext) => {
    return ctx.reply('Что вы хотите изменить?', {
        reply_markup: settingsKeyboard(ctx),
    });
};
