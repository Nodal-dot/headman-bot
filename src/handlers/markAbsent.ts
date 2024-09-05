import {MyContext} from 'types/bot';
import {markAbsentMenu} from 'keyboard';

export const markAbsentHandler = async (ctx: MyContext) => {
    await ctx.conversation.exit();

    return void (await ctx.reply(ctx.t('chooseStudentToMark'), {
        reply_markup: markAbsentMenu,
    }));
};
