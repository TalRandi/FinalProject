export class Hut {
    public hutName: string;
    public capacity: number;
    public regularPrice: number;
    public weekendPrice: number;
    public jacuzzi: boolean;
    public pool: boolean;
    public air_conditioner: boolean;
    public wifi: boolean;
    public sauna: boolean;
    public parking: boolean;
    public images: string[];

    constructor(hutName: string, capacity: number, regularPrice: number, weekendPrice: number, jacuzzi: boolean, pool: boolean,
        air_conditioner: boolean, wifi: boolean, sauna: boolean, parking: boolean, images: string[]){
            
        this.hutName = hutName;
        this.capacity = capacity
        this.regularPrice = regularPrice;
        this.weekendPrice = weekendPrice;
        this.jacuzzi = jacuzzi;
        this.pool = pool;
        this.air_conditioner = air_conditioner;
        this.wifi = wifi;
        this.sauna = sauna;
        this.parking = parking;
        this.images = images;
    }
}