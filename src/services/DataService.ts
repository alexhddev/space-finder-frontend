import { ICreateSpaceState } from "../components/spaces/CreateSpace";
import { Reservation, ReservationState, Space, User } from "../model/Model";
import { S3, config } from 'aws-sdk';
import { config as appConfig} from './config'
import { generateRandomId } from '../utils/Utils';

config.update({
    region: appConfig.REGION
})


export class DataService {

    private user: User | undefined;
    private s3Client : S3 | undefined

    /**
     * Due to a bug, the s3 client doesn't load the credentials after they are created
     * Here we are initializing it lazily
     */
    private getS3Client():S3 {
        if (this.s3Client) {
            return this.s3Client
        } else {
            this.s3Client = new S3({
                region: appConfig.REGION
            }) 
            return this.s3Client;
        }
    }

    public setUser(user: User){
        this.user = user;
    }

    public async createSpace(iCreateSpace: ICreateSpaceState){
        if (iCreateSpace.photo) {
            const photoUrl = await this.uploadPublicFile(
                iCreateSpace.photo,
                appConfig.SPACES_PHOTOS_BUCKET
            )
            iCreateSpace.photoURL = photoUrl;
            iCreateSpace.photo = undefined
        }
        const requestUrl = appConfig.api.spacesUrl;
        const requestOptions: RequestInit = {
            method: 'POST',
            body: JSON.stringify(iCreateSpace)
        }
        const result = await fetch(requestUrl, requestOptions);
        const resultJSON = await result.json();

        return JSON.stringify(resultJSON.id);
    }

    public async uploadProfilePicture(file: File){
        return await this.uploadPublicFile(file, appConfig.PROFILE_PHOTOS_BUCKET)
    }

    private async uploadPublicFile(file: File, bucket: string){
        const fileName = generateRandomId() +  file.name;
        const uploadResult = await this.getS3Client().upload({
            Bucket: bucket,
            Key: fileName,
            Body: file,
            ACL: 'public-read'
        }).promise();
        return uploadResult.Location
    }

    private getUserIdToken(){
        if (this.user) {
            return this.user.cognitoUser.getSignInUserSession()!.getIdToken().getJwtToken()
        } else {
            return '';
        }
    }

    public async getSpaces(): Promise<Space[]> {
        if (this.user) {
            console.log(`Using token: ${this.getUserIdToken()}`)
            const requestUrl = appConfig.api.spacesUrl;
            const requestResult = await fetch(
                requestUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': this.getUserIdToken()
                    }
                }
            );
            const responseJSON = await requestResult.json();
            return responseJSON;
        } else {
            return []
        }
    }

    public async reserveSpace(spaceId: string):Promise<string | undefined> {
        const requestUrl = appConfig.api.reservationsUrl;
        const requestResult = await fetch(
            requestUrl, {
                method: 'POST',
                headers: {
                    'Authorization': this.getUserIdToken()
                }, 
                body: JSON.stringify({
                    spaceId: spaceId,
                    user: this.user?.userName
                })
            }
        );
        const responseJSON = await requestResult.json();
        return responseJSON.id;
    }

    
    public async getAllReservations(): Promise<Reservation[]> {
        if (this.user?.isAdmin) {
            const requestUrl = appConfig.api.reservationsUrl;
            const requestResult = await fetch(
                requestUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': this.getUserIdToken()
                    }
                }
            );
            const responseJSON = await requestResult.json();
            return responseJSON;
        } else {
            return []
        }
    }

    public async getUserReservations(): Promise<Reservation[]> {
        if (this.user) {
            const requestUrl = `${appConfig.api.reservationsUrl}?user=${this.user.userName}`;
            const requestResult = await fetch(
                requestUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': this.getUserIdToken()
                    }
                }
            );
            const responseJSON = await requestResult.json();
            return responseJSON;
        } else {
            return [];
        }
    }

    public async deleteReservation(reservationId: string):Promise<any> {
        const requestUrl = `${appConfig.api.reservationsUrl}?reservationId=${reservationId}`;
        const requestResult = await fetch(
            requestUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': this.getUserIdToken()
                }
            }
        );
        const responseJSON = await requestResult.json();
        return responseJSON;
    }

    public async updateReservation(reservationId: string, reservationState: ReservationState):Promise<any> {
        const requestUrl = `${appConfig.api.reservationsUrl}?reservationId=${reservationId}`;
        const requestResult = await fetch(
            requestUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': this.getUserIdToken()
                }, 
                body: JSON.stringify({
                    state: reservationState
                })
            }
        );
        const responseJSON = await requestResult.json();
        return responseJSON;
    }
}