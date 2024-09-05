import {InlineKeyboard} from 'grammy';
import {MyContext} from "types/bot";

export const absenceWithReasonKeyboard = (ctx:MyContext) => new InlineKeyboard()
    .text(ctx.t('changeReasonButton'), 'addMarkReason')
    .text(ctx.t('markDeleteButton'), 'markDelete');

export const absenceWithoutReasonKeyboard = (ctx:MyContext) => new InlineKeyboard()
    .text(ctx.t('reasonButton'), 'addMarkReason')
    .text(ctx.t('markDeleteButton'), 'markDelete')
    .text(ctx.t('returnToMarkButton'), 'markMore');

export const markAbsenceKeyboard = (ctx:MyContext) => new InlineKeyboard()
    .text(ctx.t('reasonButton'), 'addMarkReason')
    .text(ctx.t('markMoreButton'), 'markMore');
