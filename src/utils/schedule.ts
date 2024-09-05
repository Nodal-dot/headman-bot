import {ISchedule} from 'types/schedule';

export const findClosestLesson = (
    schedules: ISchedule[],
    currentTime: string,
): { start: string; end: string; number: number } | null => {
    const currentTimeMinutes = timeToMinutes(currentTime);
    let closestPair: { start: string; end: string; number: number } | null =
        null;
    let closestDiff = Infinity;
    for (const schedule of schedules) {
        const startMinutes = timeToMinutes(schedule.start);
        const endMinutes = timeToMinutes(schedule.end);

        if (
            startMinutes <= currentTimeMinutes &&
            currentTimeMinutes <= endMinutes
        ) {
            return {
                start: schedule.start,
                end: schedule.end,
                number: schedule.id,
            };
        }

        const diff = Math.min(
            Math.abs(startMinutes - currentTimeMinutes),
            Math.abs(endMinutes - currentTimeMinutes),
        );
        if (diff < closestDiff) {
            closestDiff = diff;
            closestPair = {
                start: schedule.start,
                end: schedule.end,
                number: schedule.id,
            };
        }
    }

    return closestPair;
};

export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};
export const addLesson = (
    id: number,
    start: string,
    end: string,
    schedule: ISchedule[],
) => {
    const existingLessonIndex = schedule.findIndex(lesson => lesson.id === id);
    if (existingLessonIndex !== -1) {
        schedule[existingLessonIndex] = { id, start, end };
    } else {
        const newLesson = { id, start, end };
        const index = schedule.findIndex(lesson => lesson.id > id);
        if (index === -1) {
            schedule.push(newLesson);
        } else {
            schedule.splice(index, 0, newLesson);
        }
    }
    return schedule;
};
