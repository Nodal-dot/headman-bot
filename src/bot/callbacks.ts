import {Composer} from 'grammy';
import {MyContext} from 'types/bot';
import {PrismaClient} from '@prisma/client';
import {markAbsentMenu, registerKeyboard, removeStudentMenu, scheduleMenu,} from 'keyboard';
import {table} from 'utils/table';

const composer = new Composer<MyContext>();
const prisma = new PrismaClient();

composer.callbackQuery('markMore', async (ctx: MyContext) => {
    return void (await ctx.editMessageText(ctx.t('markMore'), {
        reply_markup: markAbsentMenu,
    }));
});
composer.callbackQuery('addMarkReason', async (ctx: MyContext) => {
    return void (await ctx.conversation.enter('addMarkReason'));
});
composer.callbackQuery('markDelete', async (ctx: MyContext) => {
    await ctx.deleteMessage();

    await prisma.register.delete({ where: { id: ctx.session.registerId } });
    return void (await ctx.reply(ctx.t('markDeleted'), {
        reply_markup: markAbsentMenu,
    }));
});
composer.callbackQuery('backRegister', async (ctx: MyContext) => {
    await ctx.deleteMessage();
    return void (await ctx.reply(ctx.t('returnToRegister'), {
        reply_markup: registerKeyboard(ctx),
    }));
});
composer.callbackQuery('deleteStudent', async (ctx: MyContext) => {
    return void (await ctx.editMessageText(ctx.t('studentDelete'), {
        reply_markup: removeStudentMenu,
    }));
});
composer.callbackQuery('deletePair', async (ctx: MyContext) => {
    ctx.session.schedule = ctx.session.schedule!.filter(
        ({ id }) => id !== ctx.session.lessonId,
    );
    const columnHeaders = ['№', ctx.t('start'), ctx.t('end')];
    const pairTimings = ctx.session.schedule!.map(({ id, start, end }) => [
        String(id),
        start,
        end,
    ]);
    return await ctx.editMessageText(
        `<pre>${table([columnHeaders, ...pairTimings])}</pre>${ctx.t('askForSchedule')}`,
        { parse_mode: 'HTML', reply_markup: scheduleMenu },
    );
});

composer.callbackQuery('changeTime', async (ctx: MyContext) => {
    return await ctx.conversation.enter('changeTime');
});
export { composer as callbacks };
