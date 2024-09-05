import {addLesson, findClosestLesson, timeToMinutes,} from '../../src/utils/schedule';
import {ISchedule} from '../../src/types/schedule';

describe('findClosestLesson', () => {
    it('returns the current lesson if it exists', () => {
        const schedule = [
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '10:00', end: '11:00' },
        ];
        const currentTime = '09:30';
        expect(findClosestLesson(schedule, currentTime)).toEqual({
            start: '09:00',
            end: '10:00',
            number: 1,
        });
    });

    it('returns the closest lesson if no current lesson exists', () => {
        const schedule = [
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '10:00', end: '11:00' },
        ];
        const currentTime = '08:59';
        expect(findClosestLesson(schedule, currentTime)).toEqual({
            start: '09:00',
            end: '10:00',
            number: 1,
        });
    });

    it('ignores lessons that have already ended', () => {
        const schedule = [
            { id: 1, start: '08:00', end: '09:00' },
            { id: 2, start: '10:00', end: '11:00' },
        ];
        const currentTime = '09:31';
        expect(findClosestLesson(schedule, currentTime)).toEqual({
            start: '10:00',
            end: '11:00',
            number: 2,
        });
    });

    it('ignores lessons that have not started yet', () => {
        const schedule = [
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '11:00', end: '12:00' },
        ];
        const currentTime = '10:30';
        expect(findClosestLesson(schedule, currentTime)).toEqual({
            start: '09:00',
            end: '10:00',
            number: 1,
        });
    });
    it('replace ', () => {
        const schedule = [
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '11:00', end: '12:00' },
        ];
        const currentTime = '10:30';
        expect(findClosestLesson(schedule, currentTime)).toEqual({
            start: '09:00',
            end: '10:00',
            number: 1,
        });
    });
});

describe('timeToMinutes', () => {
    it('converts time to minutes correctly', () => {
        expect(timeToMinutes('09:00')).toBe(540);
        expect(timeToMinutes('12:30')).toBe(750);
        expect(timeToMinutes('00:15')).toBe(15);
    });
});

describe('addLesson', () => {
    it('adds a new lesson to the end of the schedule if it has the highest id', () => {
        const schedule: ISchedule[] = [
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '10:00', end: '11:00' },
        ];
        const newLesson = { id: 3, start: '11:00', end: '12:00' };
        const result = addLesson(
            newLesson.id,
            newLesson.start,
            newLesson.end,
            schedule,
        );
        expect(result).toEqual([
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '10:00', end: '11:00' },
            { id: 3, start: '11:00', end: '12:00' },
        ]);
    });

    it('adds a new lesson to the middle of the schedule if it has an id between existing lessons', () => {
        const schedule: ISchedule[] = [
            { id: 1, start: '09:00', end: '10:00' },
            { id: 3, start: '11:00', end: '12:00' },
        ];
        const newLesson = { id: 2, start: '10:00', end: '11:00' };
        const result = addLesson(
            newLesson.id,
            newLesson.start,
            newLesson.end,
            schedule,
        );
        expect(result).toEqual([
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '10:00', end: '11:00' },
            { id: 3, start: '11:00', end: '12:00' },
        ]);
    });

    it('adds a new lesson to the beginning of the schedule if it has the lowest id', () => {
        const schedule: ISchedule[] = [
            { id: 2, start: '10:00', end: '11:00' },
            { id: 3, start: '11:00', end: '12:00' },
        ];
        const newLesson = { id: 1, start: '09:00', end: '10:00' };
        const result = addLesson(
            newLesson.id,
            newLesson.start,
            newLesson.end,
            schedule,
        );
        expect(result).toEqual([
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '10:00', end: '11:00' },
            { id: 3, start: '11:00', end: '12:00' },
        ]);
    });

    it('returns the original schedule if the new lesson has the same id as an existing lesson', () => {
        const schedule: ISchedule[] = [
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '10:00', end: '11:00' },
        ];
        const newLesson = { id: 1, start: '09:00', end: '10:00' };
        const result = addLesson(
            newLesson.id,
            newLesson.start,
            newLesson.end,
            schedule,
        );
        expect(result).toEqual([
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '10:00', end: '11:00' },
        ]);
    });
    it('return overwritten id', () => {
        const schedule: ISchedule[] = [
            { id: 1, start: '09:00', end: '10:00' },
            { id: 2, start: '10:00', end: '11:00' },
        ];
        const newLesson = { id: 1, start: '07:00', end: '08:00' };
        const result = addLesson(
            newLesson.id,
            newLesson.start,
            newLesson.end,
            schedule,
        );
        expect(result).toEqual([
            { id: 1, start: '07:00', end: '08:00' },
            { id: 2, start: '10:00', end: '11:00' },
        ]);
    });
});
