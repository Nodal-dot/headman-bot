import {MyContext} from 'types/bot';
import {mainKeyboard} from 'keyboard';
import {main} from 'template/main';

export const mainHandler = async (ctx: MyContext) => {
    return void (await ctx.reply(main(ctx), {
        reply_markup: mainKeyboard(ctx),
    }));
};
