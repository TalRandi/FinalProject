import { Hut } from "./hut.model"

export class Zimmer {
    public ownerName: string;
    public phone: string;
    public zimmerName: string;
    public email: string;
    public generalDescription: string;
    public total_capacity: number;
    public min_price_regular: number;
    public min_price_weekend: number;
    public region: string;
    public zimmer_id: string;
    public huts: Hut[];

    constructor(ownerName: string, phone: string, zimmerName: string, email: string, generalDescription: string, 
        total_capacity: number, min_price_regular: number, min_price_weekend: number, region: string, zimmer_id: string, huts: Hut[]){
        
        this.ownerName = ownerName;
        this.phone = phone;
        this.zimmerName = zimmerName;
        this.email = email;
        this.generalDescription = generalDescription;
        this.total_capacity = total_capacity;
        this.min_price_regular = min_price_regular;
        this.min_price_weekend = min_price_weekend;
        this.region = region;
        this.zimmer_id = zimmer_id;
        this.huts = huts;
    }
}