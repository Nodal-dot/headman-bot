import {MyContext} from 'types/bot';
import {table} from 'utils/table';
import {scheduleMenu} from 'keyboard';

export const scheduleHandler = async (ctx: MyContext) => {
    const columnHeaders = ['№', ctx.t('start'), ctx.t('end')];
    const pairTimings = ctx.session.schedule!.map(({ id, start, end }) => [
        String(id),
        start,
        end,
    ]);

    return await ctx.reply(
        `<pre>${table([columnHeaders, ...pairTimings])}</pre>${ctx.t('askForSchedule')}`,
        { parse_mode: 'HTML', reply_markup: scheduleMenu },
    );
};
