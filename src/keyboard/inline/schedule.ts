import {InlineKeyboard} from 'grammy';
import {MyContext} from 'types/bot';

export const existingLessonKeyboard = (ctx: MyContext) =>
    new InlineKeyboard()
        .text(ctx.t('changeTimeButton'), 'changeTime')
        .text(ctx.t('deletePairButton'), 'deletePair');
export const noLessonKeyboard = (ctx: MyContext) =>
    new InlineKeyboard()
        .text(ctx.t('changeTimeButton'), 'changeTime')
