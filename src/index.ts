import { EventBridgeEvent } from 'aws-lambda';
import { CloudWatchLogs } from 'aws-sdk';

interface CloudwatchLogDetail {
    eventVersion: string;
    eventTime: string;
    eventSource: string;
    eventName: string;
    awsRegion: string;
    requestParameters: {
        logGroupName: string;
        retentionPeriod?: number;
    };
}

function getDefaultRetentionPeriod(): number {
    const envRetentionPeriod = parseInt(process.env.RETENTION_PERIOD_IN_DAYS || '');
    return Number.isInteger(envRetentionPeriod) ? envRetentionPeriod : 90;
}

export async function handler(event: EventBridgeEvent<string, CloudwatchLogDetail>): Promise<void> {
    const logGroupName = event.detail.requestParameters.logGroupName;
    const region = process.env.AWS_REGION;
    const client = new CloudWatchLogs({ region: region });

    const defaultRetentionPeriod = getDefaultRetentionPeriod();
    const currentRetentionPeriod = event.detail.requestParameters.retentionPeriod;
    if (currentRetentionPeriod !== defaultRetentionPeriod) {
        await client.putRetentionPolicy({ logGroupName: logGroupName, retentionInDays: defaultRetentionPeriod }).promise();
    }
}
