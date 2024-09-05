import {MyContext, MyConversation} from 'types/bot';
import {isValidTimeRange} from 'utils/date';
import {table} from 'utils/table';
import {scheduleMenu} from 'keyboard';
import {addLesson} from 'utils/schedule';

export const changeTime = async (
    conversation: MyConversation,
    ctx: MyContext,
) => {
    await ctx.editMessageText(ctx.t('timeRangeFormat'));
    const newCtx = await conversation.waitFor('message:text');
    await ctx.deleteMessage();
    const { schedule, lessonId } = newCtx.session;
    const { text } = newCtx.message!;
    if (isValidTimeRange(text!, schedule!)) {
        const [start, end] = text!.split('-');
        newCtx.session.schedule = addLesson(lessonId!, start, end, schedule!);
        const columnHeaders = ['№', newCtx.t('start'), newCtx.t('end')];
        const pairTimings = newCtx.session.schedule!.map(
            ({ id, start, end }) => [String(id), start, end],
        );
        return void (await newCtx.reply(
            `<pre>${table([columnHeaders, ...pairTimings])}</pre>${newCtx.t('askForSchedule')}`,
            { parse_mode: 'HTML', reply_markup: scheduleMenu },
        ));
    }
    const columnHeaders = ['№', ctx.t('start'), ctx.t('end')];
    const pairTimings = ctx.session.schedule!.map(({ id, start, end }) => [
        String(id),
        start,
        end,
    ]);
    await ctx.reply('mistake');
    return void (await ctx.reply(
        `<pre>${table([columnHeaders, ...pairTimings])}</pre>${ctx.t('askForSchedule')}`,
        { parse_mode: 'HTML', reply_markup: scheduleMenu },
    ));
};
