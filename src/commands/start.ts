import {Composer} from 'grammy';
import {MyContext} from 'types/bot';
import {PrismaClient} from '@prisma/client';
import {mainKeyboard} from 'keyboard';
import {main} from 'template/main';

const prisma = new PrismaClient();
const composer = new Composer<MyContext>();

composer.command('start', async (ctx: MyContext) => {
    const user = await prisma.user.findFirst({
        where: { telegramId: String(ctx.from!.id) },
    });
    if (!user) {
        return void (await ctx.conversation.enter('newUser'));
    }
    const group = await prisma.group.findFirst({
        where: { authorId: user.id, name: user.currentGroup },
    });
    if (!group) {
        return void (await ctx.conversation.enter('newUser'));
    }
    const parsedSchedule = JSON.parse(group.schedule);
    const schedule = Object.keys(parsedSchedule).map(id => ({
        id: parseInt(id),
        start: parsedSchedule[+id].start,
        end: parsedSchedule[+id].end,
    }));
    ctx.session = {
        schedule,
        currentGroup: user.currentGroup,
        username: user.username,
        currentDate: ctx.message!.date,
    };

    return void (await ctx.reply(main(ctx), {
        reply_markup: mainKeyboard(ctx),
    }));
});

export { composer as startCommand };
