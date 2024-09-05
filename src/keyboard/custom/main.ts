import {Keyboard} from 'grammy';
import {MyContext} from 'types/bot';

export const mainKeyboard = (ctx: MyContext) =>
    new Keyboard()
        .text(ctx.t('register'))
        .row()
        .resized()
        .text(ctx.t('settings'))
        .resized();
