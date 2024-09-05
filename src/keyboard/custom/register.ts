import {Keyboard} from 'grammy';
import {MyContext} from 'types/bot';

export const registerKeyboard = (ctx: MyContext) =>
    new Keyboard()
        .text(ctx.t('add'))
        .text(ctx.t('remove'))
        .row()
        .text(ctx.t('list'))
        .row()
        .text(ctx.t('markAbsent'))
        .row()
        .text(ctx.t('menu'))
        .resized();
