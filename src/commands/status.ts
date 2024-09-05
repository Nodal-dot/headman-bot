import {MyContext} from 'types/bot';
import {Composer} from 'grammy';

const composer = new Composer<MyContext>();

composer.command('status', async (ctx: MyContext) => {
    if (Date.now() / 1000 - ctx.message!.date! < 2) {
        return void (await ctx.reply(ctx.t('status')));
    }
    return;
});
export { composer as statusCommand };
