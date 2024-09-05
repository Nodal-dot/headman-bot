import {Keyboard} from 'grammy';
import {MyContext} from 'types/bot';

export const settingsKeyboard = (ctx: MyContext) =>
    new Keyboard().text(ctx.t('schedule')).row().text(ctx.t('menu')).resized();
