import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET
const s3Client = new XAWS.S3({ signatureVersion: 'v4' })
export class AttachmentUtils{
    constructor(){}

    async createAttachmentPresignedUrl (todoId: string): Promise<string> {
        const url = s3Client.getSignedUrl('putObject', {
          Bucket: s3BucketName,
          Key: todoId,
          Expires: 2000
        })
        return url as string
    }
}