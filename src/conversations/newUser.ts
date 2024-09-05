import {MyContext, MyConversation} from 'types/bot';
import {PrismaClient} from '@prisma/client';
import {table} from 'utils/table';
import {Choose, chooseKeyboard, mainKeyboard} from 'keyboard';
import {addMonths, formatDate, ISOToDate, validateDateRange,} from 'utils/date';
import {main} from 'template/main';

const prisma = new PrismaClient();

export const newUser = async (conversation: MyConversation, ctx: MyContext) => {
    await ctx.reply(ctx.t('welcome'));

    const username = await askForUsername(conversation, ctx);
    const { startDate, endDate } = await askForDate(conversation, ctx);
    const groupName = await askForGroupName(conversation, ctx);

    const submissionData = {
        username,
        groupName,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
    };
    const confirmed = await confirmData(conversation, ctx, submissionData);
    if (!confirmed) {
        return void (await ctx.conversation.reenter('newUser'));
    }
    const columnHeaders = ['№', ctx.t('start'), ctx.t('end')];
    const pairTimings = ctx.session.schedule!.map(({ id, start, end }) => [
        String(id),
        start,
        end,
    ]);
    await ctx.reply(
        `<pre>${table([
            columnHeaders,
            ...pairTimings,
        ])}</pre>${ctx.t('infoSchedule')}`,
        { parse_mode: 'HTML' },
    );

    const user = await prisma.user.create({
        data: {
            telegramId: String(ctx.from!.id),
            username,
            currentGroup: groupName,
            groups: {
                create: {
                    name: groupName,
                    schoolYearStart: startDate,
                    schoolYearEnd: endDate,
                },
            },
        },
    });
    ctx.session = {
        currentGroup: user.currentGroup,
        username: user.username,
        currentDate: ctx.message!.date,
    };
    return void (await ctx.reply(main(ctx), {
        reply_markup: mainKeyboard(ctx),
    }));
};

const askForDate = async (conversation: MyConversation, ctx: MyContext) => {
    await ctx.reply(ctx.t('askForDate'), {
        reply_markup: chooseKeyboard(ctx),
    });

    ctx = await conversation.waitFor('callback_query');
    const { data } = ctx.callbackQuery!;
    if (data === Choose.YES) {
        await ctx.deleteMessage();
        return {
            startDate: new Date(ctx.session.currentDate! * 1000),
            endDate: addMonths(new Date(ctx.session.currentDate! * 1000), 10),
        };
    }
    await ctx.deleteMessage();
    await ctx.reply(ctx.t('dateRangeString'));
    ctx = await conversation.waitFor('message:text');
    if (!validateDateRange(ctx.message!.text!)) {
        await ctx.reply(ctx.t('incorrectDate'));
        await ctx.deleteMessage();
        return await askForDate(conversation, ctx);
    }
    const [start, end] = ctx.message!.text!.split(':');
    return { startDate: ISOToDate(start), endDate: ISOToDate(end) };
};
const askForUsername = async (conversation: MyConversation, ctx: MyContext) => {
    await ctx.reply(ctx.t('askForUsername'));
    const ctxWithMessage = await conversation.waitFor('message:text');
    return ctxWithMessage.message!.text!;
};

const askForGroupName = async (
    conversation: MyConversation,
    ctx: MyContext,
): Promise<string> => {
    await ctx.reply(ctx.t('askForGroupName'));
    const ctxWithMessage = await conversation.waitFor('message:text');
    return ctxWithMessage.message!.text!;
};

const confirmData = async (
    conversation: MyConversation,
    ctx: MyContext,
    { username, groupName, startDate, endDate }: Record<string, string>,
): Promise<boolean> => {
    await ctx.reply(
        ctx.t('confirmationTemplate', {
            username,
            groupName,
            startDate,
            endDate,
        }),
        { reply_markup: chooseKeyboard(ctx) },
    );
    ctx = await conversation.waitFor('callback_query');
    await ctx.deleteMessage();
    const { data } = ctx.callbackQuery!;
    return data === Choose.YES;
};
