import {MyContext} from 'types/bot';
import {registerKeyboard} from 'keyboard';
import {findClosestLesson} from 'utils/schedule';
import {getCurrentTime} from 'utils/date';

export const registerHandler = async (ctx: MyContext) => {
    return void (await ctx.reply(
        ctx.t('enterRegister', {
            currentLesson: String(
                findClosestLesson(ctx.session.schedule!, getCurrentTime(ctx))!
                    .number!,
            ),
        }),
        {
            reply_markup: registerKeyboard(ctx),
        },
    ));
};
