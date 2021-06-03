import { ICreateSpaceState } from "../components/spaces/CreateSpace";
import { Space } from "../model/Model";
import { S3, config } from 'aws-sdk';
import { config as appConfig} from './config'

config.update({
    region: appConfig.REGION
})


export class DataService {

    private s3Client = new S3({
        region: appConfig.REGION
    });

    public async createSpace(iCreateSpace: ICreateSpaceState){
        if (iCreateSpace.photo) {
            const photoUrl = await this.uploadPublicFile(
                iCreateSpace.photo,
                appConfig.SPACES_PHOTOS_BUCKET
            )
            console.log(photoUrl)
        }
        return '123'
    }

    private async uploadPublicFile(file: File, bucket: string){
        const fileName = file.name;
        const uploadResult = await new S3({region: appConfig.REGION}).upload({
            Bucket: bucket,
            Key: fileName,
            Body: file,
            ACL: 'public-read'
        }).promise();
        return uploadResult.Location
    }

    public async getSpaces(): Promise<Space[]> {
        const result: Space[] = []
        result.push({
            location: 'Paris',
            name: 'Best Location',
            spaceId: '123'
        });
        result.push({
            location: 'Paris',
            name: 'Best Location',
            spaceId: '124'
        });
        result.push({
            location: 'Paris',
            name: 'Best Location',
            spaceId: '125'
        });
        return result;
    }

    public async reserveSpace(spaceId: string):Promise<string | undefined> {
        if (spaceId === '123') {
            return('5555')
        } else {
            return undefined
        }
    }
}