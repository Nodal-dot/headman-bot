import {formatDate, isValidTimeRange, validateDateRange,} from '../../src/utils/date';

describe('formatDate', () => {
    it('should format a date in the correct format', () => {
        const date = new Date('2022-07-25T00:00:00.000Z');
        expect(formatDate(date)).toBe('2022.07.25');
    });

    it('should pad the month and day with zeros if necessary', () => {
        const date = new Date('2022-01-01T00:00:00.000Z');
        expect(formatDate(date)).toBe('2022.01.01');
    });

    it('should handle dates in different time zones', () => {
        const date = new Date('2022-07-25T12:00:00.000Z');
        expect(formatDate(date)).toBe('2022.07.25');
    });
});
describe('validateDateRange', () => {
    it('returns error for invalid date format', () => {
        expect(validateDateRange('invalid date format')).toEqual(false);
    });

    it('returns false for invalid start date', () => {
        expect(validateDateRange('2022-02-28:2023-03-01')).toBe(false);
    });

    it('returns false for invalid end date', () => {
        expect(validateDateRange('2023-02-28:2022-03-01')).toBe(false);
    });

    it('returns false for start date greater than end date', () => {
        expect(validateDateRange('2023-03-01:2023-02-28')).toBe(false);
    });

    it('returns true for valid date range', () => {
        expect(validateDateRange('2023-02-28:2023-03-01')).toBe(true);
    });

    it('returns true for same date range', () => {
        expect(validateDateRange('2023-02-28:2023-02-28')).toBe(true);
    });
});

describe('isValidTimeRange', () => {
    it('returns false for invalid time format', () => {
        expect(isValidTimeRange('invalid time', [])).toBe(false);
    });

    it('returns false for time range that overlaps with another lesson', () => {
        const schedule = [
            { id: 1, start: '8:30', end: '10:00' },
            { id: 2, start: '10:10', end: '11:40' },
        ];
        expect(isValidTimeRange('9:00-10:30', schedule)).toBe(false);
    });

    it('returns true for time range that does not overlap with another lesson', () => {
        const schedule = [
            { id: 1, start: '8:30', end: '10:00' },
            { id: 2, start: '10:10', end: '11:40' },
        ];
        expect(isValidTimeRange('11:50-12:50', schedule)).toBe(true);
    });

    it('returns false for time range that is exactly the same as another lesson', () => {
        const schedule = [{ id: 1, start: '8:30', end: '10:00' }];
        expect(isValidTimeRange('8:30-10:00', schedule)).toBe(false);
    });
    it('returns true', () => {
        const schedule = [{ id: 2, start: '10:10', end: '11:40' }];
        expect(isValidTimeRange('8:30-10:00', schedule)).toBe(true);
    });
    it('test', () => {
        const schedule = [
            { id: 1, start: '8:30', end: '10:00' },
            { id: 2, start: '10:10', end: '11:40' },
        ];
        expect(isValidTimeRange('7:30-9:30', schedule, 1)).toBe(true);
    });
});
