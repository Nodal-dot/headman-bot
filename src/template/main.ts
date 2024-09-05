import {MyContext} from 'types/bot';
import {getCurrentDate} from 'utils/date';

export const main = (ctx: MyContext) =>
    ctx.t('main', {
        username: ctx.session.username!,
        groupName: ctx.session.currentGroup!,
        date: getCurrentDate(ctx),
        time: new Date(ctx.session.currentDate! * 1000).toLocaleTimeString(),
    });
