import AWS, { SQS } from 'aws-sdk';

export class SqsManagementService {
  private sqs: SQS;

  constructor() {
    this.sqs = new AWS.SQS({ region: 'eu-west-1' });
  }

  async sendMessage(data: Record<string, unknown>): Promise<void> {
    await this.sqs.sendMessage({
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify(data),
    }).promise();
  }
}
