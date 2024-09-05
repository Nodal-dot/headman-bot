import {Menu, MenuRange} from '@grammyjs/menu';
import {MyContext} from 'types/bot';
import {PrismaClient} from '@prisma/client';
import {InlineKeyboard} from 'grammy';
import {
    absenceWithoutReasonKeyboard,
    absenceWithReasonKeyboard,
    markAbsenceKeyboard,
    registerKeyboard,
} from 'keyboard';
import {getCurrentTime, timeToISOString} from 'utils/date';
import {findClosestLesson} from 'utils/schedule';
import {ISchedule} from 'types/schedule';

const prisma = new PrismaClient();
export const markAbsentMenu = new Menu<MyContext>('selectAbsentStudent')
    .dynamic(async (ctx, range: MenuRange<MyContext>) => {
        const group = await prisma.group.findFirst({
            where: {
                author: { telegramId: String(ctx.from!.id) },
                name: ctx.session.currentGroup,
            },
        });
        if (!group) throw Error();
        const schedule: ISchedule[] = ctx.session.schedule!;
        const { start, end } = findClosestLesson(
            schedule,
            getCurrentTime(ctx),
        )!;
        const students = await prisma.student.findMany({
            where: { groupId: group!.id },
            select: {
                name: true,
                id: true,
                registers: {
                    where: {
                        date: {
                            gt: timeToISOString(ctx, start),
                            lt: timeToISOString(ctx, end),
                        },
                    },
                    select: { date: true, reason: true, id: true },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        const countColumn = Math.floor(Math.sqrt(students.length)) - 1;
        let i = 0;
        for (const { name, id, registers } of students) {
            const statusMap = {
                empty: `✅ ${name}`,
                noReason: `⛔️ ${name}`,
                withReason: `❗️ ${name}`,
            };

            const status =
                registers.length === 0
                    ? 'empty'
                    : registers[0].reason === null
                      ? 'noReason'
                      : 'withReason';
            range.text(statusMap[status], async (ctx: MyContext) => {
                if (registers.length === 0) {
                    ctx.session.registerId = await createRegister(id);
                    return await sendReply(
                        ctx,
                        ctx.t('markSuccess'),
                        markAbsenceKeyboard(ctx),
                    );
                } else {
                    const register = registers[0];
                    ctx.session.registerId = register.id;
                    const replyText = getReplyText(ctx, register, name);
                    return await sendReply(
                        ctx,
                        replyText,
                        getReplyMarkup(ctx,register),
                    );
                }
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

async function createRegister(studentId: number): Promise<number> {
    const { id: registerId } = await prisma.register.create({
        data: { studentId },
    });
    return registerId;
}

function getReplyText(
    ctx: MyContext,
    register: { reason: null | string },
    name: string,
): string {
    return register.reason === null
        ? ctx.t('absentWithoutReason', { studentName: name })
        : ctx.t('absentWithReason', {
              studentName: name,
              reason: register.reason,
          });
}

function getReplyMarkup(ctx:MyContext,register: { reason: null | string }): InlineKeyboard {
    return register.reason === null
        ? absenceWithoutReasonKeyboard(ctx)
        : absenceWithReasonKeyboard(ctx)
}

async function sendReply(
    ctx: MyContext,
    text: string,
    replyMarkup: InlineKeyboard,
) {
    return await ctx.editMessageText(text, { reply_markup: replyMarkup });
}
