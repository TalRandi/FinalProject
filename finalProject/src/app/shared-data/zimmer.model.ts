import { Hut } from "./hut.model"

export class Zimmer {
    public ownerName: string;
    public phone: string;
    public zimmerName: string;
    public email: string;
    public generalDescription: string;
    public total_capacity: number;
    public status: string;  // Can be accepted, pending or disabled
    public min_price_regular: number;
    public min_price_weekend: number;
    public region: string;
    public zimmer_id: string;
    public features: string[];
    public images: string[] = [];
    public huts: Hut[];

    constructor(ownerName: string, phone: string, zimmerName: string, email: string, generalDescription: string, 
        total_capacity: number, status: string, min_price_regular: number, min_price_weekend: number, region: string, zimmer_id: string, features: string[], huts: Hut[]){
        
        this.ownerName = ownerName;
        this.phone = phone;
        this.zimmerName = zimmerName;
        this.email = email;
        this.generalDescription = generalDescription;
        this.total_capacity = total_capacity;
        this.status = status;
        this.min_price_regular = min_price_regular;
        this.min_price_weekend = min_price_weekend;
        this.region = region;
        this.zimmer_id = zimmer_id;
        this.features = features;
        this.huts = huts;  
    }
}