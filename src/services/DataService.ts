import { ICreateSpaceState } from "../components/spaces/CreateSpace";
import { Space } from "../model/Model";
import { generateRandomId } from '../utils/Utils'
import { S3, config} from 'aws-sdk';
import { config as appConfig } from './config';

config.update({
    region: appConfig.REGION,
});

export class DataService {

    private s3Client = new S3({ region: appConfig.REGION });

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

    public async createSpace(iCreateSpace: ICreateSpaceState): Promise<String | undefined> {
        try {
            if (iCreateSpace.photo) {
                const photoURL = await this.uploadPublicFile(iCreateSpace.photo, appConfig.SPACES_PHOTOS_BUCKET);
                console.log(photoURL);
                iCreateSpace.photoURL = photoURL;
                iCreateSpace.photo = undefined;
            }
            const requestURL = appConfig.API_INVOKE_URL + 'spaces';
            const requestOptions: RequestInit = {
                method: 'POST',
                body: JSON.stringify(iCreateSpace)
            }
            const requestResult = await fetch(requestURL, requestOptions);
            const responseJson = await requestResult.json();
            return JSON.stringify(responseJson.id);
        } catch (error) {
            console.error(error);
        }
    }

    private async uploadPublicFile(file: File, bucket: string): Promise<string> {
        const fileName = generateRandomId() + file.name;
        const uploadResult = await new S3({ region: appConfig.REGION }).upload({
            Bucket: bucket,
            Key: fileName,
            Body: file,
            ACL: 'public-read'
        }).promise();
        return uploadResult.Location;
    }
}