import {InlineKeyboard} from 'grammy';
import {MyContext} from "types/bot";

export const removedStudentKeyboard = (ctx:MyContext) => new InlineKeyboard()
    .text(ctx.t('backRegisterButton'), 'backRegister')
    .text(ctx.t('deleteStudentButton'), 'deleteStudent');
