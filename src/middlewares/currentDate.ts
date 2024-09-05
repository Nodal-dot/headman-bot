import {MyContext} from 'types/bot';
import {NextFunction} from 'grammy';

export const currentDate = async (ctx: MyContext, next: NextFunction) => {
    if (!ctx.message) return void (await next());
    ctx.session.currentDate = ctx.message.date;
    return void (await next());
};
