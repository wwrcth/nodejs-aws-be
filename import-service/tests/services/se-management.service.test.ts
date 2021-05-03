import { S3ManagementService } from '@services/s3-management.service';

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => ({ getSignedUrl: jest.fn(() => 'signed-url') })) };
});

describe('S3ManagementService', () => {
  test('getSignedUrl method should use getSignedUrl from S3', async () => {
    const s3ManagementService = new S3ManagementService();
    const result = await s3ManagementService.getSignedUrl('');

    expect(result).toBe('signed-url');
  });
});
