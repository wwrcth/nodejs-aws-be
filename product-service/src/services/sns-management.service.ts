import AWS, { SNS } from 'aws-sdk';

export class SnsManagementService {
  private sns: SNS;

  constructor() {
    this.sns = new AWS.SNS({ region: 'eu-west-1' });
  }

  async publish(message: string, price: string): Promise<void> {
    await this.sns.publish({
      Subject: 'Import Products CSV info',
      Message: message,
      MessageAttributes: {
        price: {
          DataType: 'Number',
          StringValue: price,
        }
      },
      TopicArn: process.env.SNS_ARN,
    }).promise();
  }
}
