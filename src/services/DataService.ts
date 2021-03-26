import { Space } from "../model/Model";



export class DataService {

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