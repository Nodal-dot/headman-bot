import {MyContext} from 'types/bot';

export const addStudentHandler = async (ctx: MyContext) => {
    await ctx.conversation.exit();
    return void (await ctx.conversation.enter('addStudent'));
};
