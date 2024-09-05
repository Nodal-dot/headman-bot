import {MyContext} from 'types/bot';

export const confirmation = (ctx: MyContext) =>
    ctx.t('confirmationTemplate', {
        username,
        groupName,
        startDate,
        endDate,
    });
