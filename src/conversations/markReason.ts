import {MyContext, MyConversation} from 'types/bot';
import {PrismaClient} from '@prisma/client';
import {markAbsentMenu} from 'keyboard';

const prisma = new PrismaClient();
export const addMarkReason = async (
    conversation: MyConversation,
    ctx: MyContext,
) => {
    const reason = await askForReason(conversation, ctx);
    await prisma.register.update({
        data: { reason },
        where: { id: ctx.session.registerId },
    });
    return void (await ctx.reply(ctx.t('chooseStudentToMark'), {
        reply_markup: markAbsentMenu,
    }));
};
const askForReason = async (
    conversation: MyConversation,
    ctx: MyContext,
): Promise<string> => {
    await ctx.editMessageText(ctx.t('enterReason'));
    ctx = await conversation.waitFor('message:text');
    return ctx.message!.text!;
};
