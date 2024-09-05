import {Menu, MenuRange} from '@grammyjs/menu';
import {MyContext} from 'types/bot';
import {registerKeyboard} from 'keyboard';
import {PrismaClient} from '@prisma/client';
import {removedStudentKeyboard} from 'keyboard/inline/removeStudent';

const prisma = new PrismaClient();

export const removeStudentMenu = new Menu<MyContext>('removeStudent')
    .dynamic(async (ctx, range: MenuRange<MyContext>) => {
        const group = await prisma.group.findFirst({
            where: {
                author: { telegramId: String(ctx.from!.id) },
                name: ctx.session.currentGroup,
            },
        });
        const students = await prisma.student.findMany({
            where: { groupId: group!.id! },
            select: {
                name: true,
                id: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        const countColumn = Math.floor(Math.sqrt(students.length)) - 1;
        let i = 0;
        for (const { id, name } of students) {
            range.text(name, async (ctx: MyContext) => {
                await prisma.student.delete({ where: { id } });
                return await ctx.editMessageText(
                    ctx.t('deleteStudentSuccessButton'),
                    {
                        reply_markup: removedStudentKeyboard(ctx),
                    },
                );
            });
            i++;
            if (i % countColumn === 0) {
                range.row();
            }
        }
    })
    .row()
    .text('🔙', async (ctx: MyContext) => {
        await ctx.deleteMessage();
        await ctx.reply(ctx.t('returnToRegister'), {
            reply_markup: registerKeyboard(ctx),
        });
    });
