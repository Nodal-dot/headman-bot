import {InlineKeyboard} from 'grammy';
import {MyContext} from 'types/bot';

export enum Choose {
    YES = 'yes',
    NO = 'no',
}
export const chooseKeyboard = (ctx: MyContext) => {
    const randomNumber = Math.floor(Math.random() * 8) + 1;

    return new InlineKeyboard()
        .text(ctx.t(`agreement_${randomNumber}`), Choose.YES)
        .text(ctx.t(`refusal_${randomNumber}`), Choose.NO);
};
