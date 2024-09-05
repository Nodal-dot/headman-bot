import {MyContext} from 'types/bot';
import {removeStudentMenu} from 'keyboard';

export const deleteStudentHandler = async (ctx: MyContext) => {
    await ctx.conversation.exit();
    return await ctx.reply(ctx.t('selectStudentToDelete'), {
        reply_markup: removeStudentMenu,
    });
};
