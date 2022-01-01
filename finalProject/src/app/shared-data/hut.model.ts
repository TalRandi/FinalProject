export class Hut {
    public hutName: string;
    public capacity: number;
    public regularPrice: number;
    public weekendPrice: number;
    public jacuzzi: boolean;
    public pool: boolean;
    public images: string[];

    constructor(hutName: string, capacity: number, regularPrice: number, weekendPrice: number, jacuzzi: boolean, pool: boolean, images: string[]){
        this.hutName = hutName;
        this.capacity = capacity
        this.regularPrice = regularPrice;
        this.weekendPrice = weekendPrice;
        this.jacuzzi = jacuzzi;
        this.pool = pool;
        this.images = images;
    }
}