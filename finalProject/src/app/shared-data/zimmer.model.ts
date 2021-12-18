export class Zimmer {
    public name: string;
    public description: string;
    public total_capacity: number;
    public region: string;
    public images: string[];

    constructor(name: string, desc: string, total_capacity: number, region: string, images: string[]){
        this.name = name;
        this.description = desc;
        this.images = images;
        this.total_capacity = total_capacity;
        this.region = region;
    }
}