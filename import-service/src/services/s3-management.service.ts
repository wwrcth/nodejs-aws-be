import AWS from 'aws-sdk';
import csv from 'csv-parser';

import { SqsManagementService } from '@services/sqs-management.service';

export class S3ManagementService {
  private s3;

  constructor(
    private sqsManagementService: SqsManagementService,
  ) {
    this.s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: 'v4' });
  }

  private getTargetPath(filePath: string, targetFolder: string): string {
    const currentFolder = filePath.substring(0, filePath.indexOf('/'));

    return filePath.replace(currentFolder, targetFolder)
  }

  private async moveFileToAnotherFolder(bucketName: string, filePath: string, targetFolder: string): Promise<void> {
    const copyParams = {
      Bucket: bucketName,
      CopySource: `${bucketName}/${filePath}`,
      Key: this.getTargetPath(filePath, targetFolder),
    };
    await this.s3.copyObject(copyParams).promise();

    await this.s3.deleteObject({ Bucket: bucketName, Key: filePath }).promise();
  }

  getSignedUrl(name: string): Promise<string> {
    const params = {
      Bucket: 'aws-products-file-import',
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv',
      ACL: 'public-read',
    };

    return this.s3.getSignedUrl('putObject', params);
  }

  parseFileData({ bucket, object }): Promise<void> {
    const bucketName = bucket.name;
    const filePath = object.key;
    const s3Stream = this.s3.getObject({ Bucket: bucketName, Key: filePath }).createReadStream();

    return new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv())
        .on('data', async (data) => {
          console.log(`Parsed data: ${JSON.stringify(data)}`);

          if (this.sqsManagementService) {
            await this.sqsManagementService.sendMessage(data);
            console.log('Sending message to SQS is finished');
          }
        })
        .on('error', (err) => {console.log('error callback'); reject(`Error during parsing file's data: ${err}`); })
        .on('end', async () => {
          await this.moveFileToAnotherFolder(bucketName, filePath, 'parsed');
          resolve();
        });
    });
  }
}
