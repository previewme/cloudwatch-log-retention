import { default as createLogGroup } from './resources/cw-event-create-log-group.json';
import { default as putRetentionPolicy } from './resources/cw-event-put-retention-period.json';
import { handler } from '../src';

const mockPutRetentionPolicy = jest.fn(() => {
    return {
        promise: jest.fn(() => Promise.resolve({}))
    };
});

jest.mock('aws-sdk', () => {
    return {
        CloudWatchLogs: jest.fn(() => {
            return {
                putRetentionPolicy: mockPutRetentionPolicy
            };
        })
    };
});

describe('Cloudwatch Logs have retention policy set correctly', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        process.env = { ...OLD_ENV };
        process.env.RETENTION_PERIOD_IN_DAYS = '30';
        putRetentionPolicy.detail.requestParameters.retentionInDays = 1;
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    test('Sets the default retention period when environment variable not set', async () => {
        delete process.env.RETENTION_PERIOD_IN_DAYS;
        await expect(handler(createLogGroup));

        const calls = mockPutRetentionPolicy.mock.calls;
        expect(calls[0]).toEqual([
            {
                logGroupName: 'bhavik-test-log',
                retentionInDays: 90
            }
        ]);
    });

    test('Sets the retention period when log group is created', async () => {
        await expect(handler(createLogGroup));

        const calls = mockPutRetentionPolicy.mock.calls;
        expect(calls[0]).toEqual([
            {
                logGroupName: 'bhavik-test-log',
                retentionInDays: 30
            }
        ]);
    });

    test('Sets the retention period when it does not match the default', async () => {
        await expect(handler(putRetentionPolicy));

        const calls = mockPutRetentionPolicy.mock.calls;
        expect(calls[0]).toEqual([
            {
                logGroupName: 'bhavik-test-log',
                retentionInDays: 30
            }
        ]);
    });

    test('Does not set retention period when it already matches', async () => {
        putRetentionPolicy.detail.requestParameters.retentionInDays = 30;
        await expect(handler(putRetentionPolicy));
        expect(mockPutRetentionPolicy).not.toHaveBeenCalled();
    });
});
