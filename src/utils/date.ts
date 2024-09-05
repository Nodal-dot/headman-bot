import {ISchedule} from 'types/schedule';
import {MyContext} from 'types/bot';

export const getCurrentDate = (ctx: MyContext): string => {
    const date = new Date(ctx.session.currentDate! * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
export const addMonths = (date: Date, months: number): Date => {
    const d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    return date;
};
export const timeToISOString = (ctx: MyContext, time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date(ctx.session.currentDate! * 1000);
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now.toISOString();
};

export const ISOToDate = (iso: string): Date => {
    const dateParts = iso.split('-');
    return new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
};

export const formatDate = (date: Date) => {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
};
export const validateDateRange = (dateString: string) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}:\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
        return false;
    }

    const [startDate, endDate] = dateString.split(':');
    const startYear = parseInt(startDate.substring(0, 4));
    const startMonth = parseInt(startDate.substring(5, 7));
    const startDay = parseInt(startDate.substring(8, 10));
    const endYear = parseInt(endDate.substring(0, 4));
    const endMonth = parseInt(endDate.substring(5, 7));
    const endDay = parseInt(endDate.substring(8, 10));

    const isValidDate = (year: number, month: number, day: number) => {
        return (
            year >= 2023 && month >= 1 && month <= 12 && day >= 1 && day <= 31
        );
    };

    if (
        !isValidDate(startYear, startMonth, startDay) ||
        !isValidDate(endYear, endMonth, endDay)
    ) {
        return false;
    }

    if (
        !(
            startYear < endYear ||
            (startYear === endYear && startMonth < endMonth) ||
            (startYear === endYear &&
                startMonth === endMonth &&
                startDay <= endDay)
        )
    ) {
        return false;
    }

    return true;
};

export const isValidTimeRange = (
    timeString: string,
    schedules: ISchedule[],
    lessonId?: number,
) => {
    const timeRegex = /^([01]?\d|2[0-3]):\d{2}-([01]?\d|2[0-3]):\d{2}$/;
    if (!timeRegex.test(timeString)) {
        return false;
    }

    const [start, end] = timeString.split('-');
    const startMinutes =
        parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
    const endMinutes =
        parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);

    if (lessonId !== undefined) {
        const existingSchedule = schedules.find(
            schedule => schedule.id === lessonId,
        );
        if (existingSchedule) {
            const existingStartMinutes =
                parseInt(existingSchedule.start.split(':')[0]) * 60 +
                parseInt(existingSchedule.start.split(':')[1]);
            const existingEndMinutes =
                parseInt(existingSchedule.end.split(':')[0]) * 60 +
                parseInt(existingSchedule.end.split(':')[1]);

            for (const schedule of schedules) {
                if (schedule.id !== lessonId) {
                    const scheduleStartMinutes =
                        parseInt(schedule.start.split(':')[0]) * 60 +
                        parseInt(schedule.start.split(':')[1]);
                    const scheduleEndMinutes =
                        parseInt(schedule.end.split(':')[0]) * 60 +
                        parseInt(schedule.end.split(':')[1]);

                    if (
                        (startMinutes < scheduleEndMinutes &&
                            endMinutes > scheduleStartMinutes) ||
                        (existingStartMinutes < scheduleEndMinutes &&
                            existingEndMinutes > scheduleStartMinutes)
                    ) {
                        return false;
                    }
                }
            }
        }
    } else {
        for (const schedule of schedules) {
            const scheduleStartMinutes =
                parseInt(schedule.start.split(':')[0]) * 60 +
                parseInt(schedule.start.split(':')[1]);
            const scheduleEndMinutes =
                parseInt(schedule.end.split(':')[0]) * 60 +
                parseInt(schedule.end.split(':')[1]);

            if (
                startMinutes < scheduleEndMinutes &&
                endMinutes > scheduleStartMinutes
            ) {
                return false;
            }
        }
    }

    return true;
};
export const getCurrentTime = (ctx: MyContext): string => {
    const now = new Date(ctx.session.currentDate! * 1000);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};
