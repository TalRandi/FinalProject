export class Hut {
    public name: string;
    public regular_price: number;
    public weekend_price: number;
    public capacity: number;
    public images: string[];

    constructor(name: string, reg_price: number, weekend_price: number, capacity: number, images: string[]){
        this.name = name;
        this.regular_price = reg_price;
        this.weekend_price = weekend_price;
        this.capacity = capacity
        this.images = images;
    }
}