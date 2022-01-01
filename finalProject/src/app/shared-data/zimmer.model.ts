import { Hut } from "./hut.model"

export class Zimmer {
    public ownerName: string;
    public phone: number;
    public zimmerName: string;
    public email: string;
    public generalDescription: string;
    public total_capacity: number;
    public region: string;
    public images: string[];
    public huts: Hut[];

    constructor(ownerName: string, phone: number, zimmerName: string, email: string, generalDescription: string, 
        total_capacity: number, region: string, images: string[], huts: Hut[]){
        
        this.ownerName = ownerName;
        this.phone = phone;
        this.zimmerName = zimmerName;
        this.email = email;
        this.generalDescription = generalDescription;
        this.total_capacity = total_capacity;
        this.region = region;
        this.images = images;
        this.huts = huts;
    }
}