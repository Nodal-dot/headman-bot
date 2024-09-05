import {standardSchedule} from 'constants/schedule';
import {ISchedule} from 'types/schedule';

export interface SessionData {
    username?: string;
    currentGroup?: string;
    currentDate?: number;
    registerId?: number;
    schedule?: ISchedule[];
    lessonId?: number;
}

export const initial = (): SessionData => {
    return { schedule: standardSchedule };
};
