import {MyContext, MyConversation} from 'types/bot';
import {PrismaClient} from '@prisma/client';
import {Choose, chooseKeyboard, registerKeyboard} from 'keyboard';
import {table} from 'utils/table';

const prisma = new PrismaClient();
const VALID_NAMES_REGEX = /^[a-zA-Zа-яА-ЯёЁ ]+(,[a-zA-Zа-яА-ЯёЁ ]+)*$/;

export const addStudent = async (
    conversation: MyConversation,
    ctx: MyContext,
) => {
    ctx = await askForNewStudents(conversation, ctx);
    const studentOrStudents = ctx.message!.text!;

    if (!VALID_NAMES_REGEX.test(studentOrStudents)) {
        await ctx.reply(ctx.t('incorrectStudent'));
        return void (await ctx.conversation.reenter('addStudent'));
    }
    const group = await prisma.group.findFirst({
        where: { name: ctx.session.currentGroup },
    });
    if (studentOrStudents.includes(',')) {
        const students = studentOrStudents
            .split(',')
            .map(val => val.trim())
            .filter(Boolean);
        const existingStudents = await prisma.student.findMany({
            where: {
                name: { in: students },
            },
        });

        if (existingStudents.length === 0) {
            const uniqueStudents = [...new Set(students)];
            const { confirmed, newCtx } = await confirmData(
                conversation,
                ctx,
                uniqueStudents,
            );
            ctx = newCtx;
            if (!confirmed) {
                return void (await ctx.conversation.reenter('addStudent'));
            }
            await prisma.student.createMany({
                data: uniqueStudents.map(name => ({
                    name,
                    groupId: group!.id,
                })),
            });
            return ctx.reply(ctx.t('addStudentsSuccess'), {
                reply_markup: registerKeyboard(ctx),
            });
        } else {
            const existingStudentNames = existingStudents.map(
                student => student.name,
            );
            const newStudentNames = [
                ...new Set(
                    students.filter(
                        name => !existingStudentNames.includes(name),
                    ),
                ),
            ];
            const duplicateStudentNames = students.filter(name =>
                existingStudentNames.includes(name),
            );

            if (students.length === duplicateStudentNames.length) {
                await ctx.reply(ctx.t('studentsAlreadyExists'));
                return void (await ctx.conversation.reenter('addStudent'));
            }

            const { confirmed, newCtx } = await confirmData(
                conversation,
                ctx,
                newStudentNames,
                duplicateStudentNames,
            );
            ctx = newCtx;

            if (!confirmed) {
                return void (await ctx.conversation.reenter('addStudent'));
            }

            await prisma.student.createMany({
                data: newStudentNames.map(name => ({
                    name,
                    groupId: group!.id,
                })),
            });

            return ctx.reply(ctx.t('addStudentsSuccess'), {
                reply_markup: registerKeyboard(ctx),
            });
        }
    }
    const { confirmed, newCtx } = await confirmData(
        conversation,
        ctx,
        studentOrStudents,
    );
    ctx = newCtx;
    if (!confirmed) {
        return void (await ctx.conversation.reenter('addStudent'));
    }

    const studentExists = await prisma.student.findFirst({
        where: { name: studentOrStudents, group: { id: group!.id } },
    });
    if (!studentExists) {
        await prisma.student.create({
            data: {
                name: studentOrStudents,
                group: { connect: { id: group!.id } },
            },
        });
        return ctx.reply(ctx.t('addStudentSuccess'), {
            reply_markup: registerKeyboard(ctx),
        });
    }
    return ctx.reply(
        ctx.t('studentAlreadyExists', { student: studentOrStudents }),
        {
            reply_markup: registerKeyboard(ctx),
        },
    );
};

const askForNewStudents = async (
    conversation: MyConversation,
    ctx: MyContext,
) => {
    await ctx.reply(ctx.t('askForNewStudents'));
    return await conversation.waitFor(['message:text']);
};
const confirmData = async (
    conversation: MyConversation,
    ctx: MyContext,
    studentOrStudents: string | string[],
    existingStudents?: string[],
): Promise<{ newCtx: MyContext; confirmed: boolean }> => {
    const message = Array.isArray(studentOrStudents)
        ? getMultiStudentMessage(ctx, studentOrStudents, existingStudents)
        : getSingleStudentMessage(ctx, studentOrStudents);

    await ctx.reply(message, {
        reply_markup: chooseKeyboard(ctx),
        parse_mode: 'HTML',
    });
    const ctxWithCallback = await conversation.waitFor('callback_query');
    const { data } = ctxWithCallback.callbackQuery!;
    await ctxWithCallback.deleteMessage();
    return { newCtx: ctxWithCallback, confirmed: data === Choose.YES };
};

const getSingleStudentMessage = (ctx: MyContext, newStudent: string) =>
    ctx.t('confirmAddStudent', { student: newStudent });

const getMultiStudentMessage = (
    ctx: MyContext,
    newStudents: string[],
    existingStudents?: string[],
) => {
    if (existingStudents) {
        const columnHeaders = [ctx.t('new'), ctx.t('old')];
        const pairedStudents = newStudents.map((newStudent, index) => [
            newStudent ?? '',
            existingStudents[index] ?? '',
        ]);
        return `<pre>${table([columnHeaders, ...pairedStudents])}</pre>\n${ctx.t('addNewStudentsToJournal')}`;
    }
    const columnHeaders = [ctx.t('students')];
    const newStudentList = newStudents.map(val => [val]);
    return `<pre>${table([columnHeaders, ...newStudentList])}</pre>\n${ctx.t('confirmAddStudents')}`;
};
