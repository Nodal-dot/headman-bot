import {PrismaClient} from '@prisma/client';
import {MyContext} from 'types/bot';
import {NextFunction} from 'grammy';

const prisma = new PrismaClient();

export const userExists = async (ctx: MyContext, next: NextFunction) => {
    if (Object.values(ctx.session).some(x => x === '')) {
        const user = await prisma.user.findFirst({
            where: { telegramId: String(ctx.from!.id) },
            select: { username: true, currentGroup: true, id: true },
        });
        if (!user) {
            return void ctx.reply(ctx.t('unregisteredUser'));
        }
        const group = await prisma.group.findFirst({
            where: { authorId: user.id, name: user.currentGroup },
        });
        if (!group) {
            return void ctx.reply(ctx.t('unregisteredUser'));
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
    }
    return void (await next());
};
