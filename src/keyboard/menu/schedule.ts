import {Menu, MenuRange} from '@grammyjs/menu';
import {MyContext} from 'types/bot';
import {ISchedule} from 'types/schedule';
import {mainKeyboard} from 'keyboard';
import {main} from 'template/main';
import {existingLessonKeyboard, noLessonKeyboard,} from 'keyboard/inline/schedule';

export const scheduleMenu = new Menu<MyContext>('scheduleMenu')
    .dynamic(async (ctx, range: MenuRange<MyContext>) => {
        const countOfSchedule = 10;
        const countColumn = Math.floor(Math.sqrt(countOfSchedule)) - 1;
        for (let i = 1; i <= countOfSchedule; i++) {
            const schedule = ctx.session.schedule!;
            const lessonTimeSet = checkIdExistence(schedule, i);
            range.text(
                lessonTimeSet ? `✅ ${String(i)}` : String(i),
                async (ctx: MyContext) => {
                    ctx.session.lessonId = i;
                    await ctx.editMessageText('Что вы хотите сделать?', {
                        reply_markup: lessonTimeSet
                            ? existingLessonKeyboard(ctx)
                            : noLessonKeyboard(ctx),
                    });
                },
            );
            if (i % countColumn === 0) {
                range.row();
            }
        }
    })
    .row()
    // Todo тут сохрание в бд и в
    .text('✅', async (ctx: MyContext) => {
        await ctx.reply('lu');
    })
    .row()
    .text('🔙', async (ctx: MyContext) => {
        await ctx.deleteMessage();
        await ctx.reply(main(ctx), {
            reply_markup: mainKeyboard(ctx),
        });
    });
function checkIdExistence(schedule: ISchedule[], id: number) {
    return schedule.some(lesson => lesson.id === id);
}
