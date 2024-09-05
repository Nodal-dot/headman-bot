import {MyContext} from 'types/bot';
import {PrismaClient} from '@prisma/client';
import {table} from 'utils/table';

const prisma = new PrismaClient();
export const listHandler = async (ctx: MyContext) => {
    const group = await prisma.group.findFirst({
        where: {
            author: { telegramId: String(ctx.from!.id) },
            name: ctx.session.currentGroup,
        },
    });
    const students = await prisma.student.findMany({
        where: { groupId: group!.id },
        select: {
            name: true,
        },
        orderBy: {
            name: 'asc',
        },
    });
    if (students.length === 0) {
        return void (await ctx.reply(ctx.t('emptyList')));
    }
    const studentsList = students.map((student, index) => {
        return [String(index + 1), student.name];
    });
    //refactoring
    const tableData = [['№', 'Ученики'], ...studentsList];
    const studentsTable = table(tableData);
    await ctx.reply(`<pre>${studentsTable}</pre>`, { parse_mode: 'HTML' });
};
