import {MyContext} from 'types/bot';

export const confirmation = (ctx: MyContext,{username,groupName,startDate,endDate}:Record<string,string>) =>
    ctx.t('confirmation', {
        username,
        groupName,
        startDate,
        endDate,
    });
