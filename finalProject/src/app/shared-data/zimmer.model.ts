export class Zimmer {
    public name: string;
    public description: string;
    public price: number;
    public capacity: number;
    public region: string;
    public images: string[];

    constructor(name: string, desc: string, price: number, capacity: number, region: string, images: string[]){
        this.name = name;
        this.description = desc;
        this.price = price;
        this.images = images;
        this.capacity = capacity
        this.region = region;
    }
}