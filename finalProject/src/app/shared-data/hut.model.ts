import { CalendarEvent } from "angular-calendar";

export class Hut {
    public hutName: string;
    public capacity: number;
    public regularPrice: number;
    public weekendPrice: number;
    public regularPriceTwoNights: number;
    public weekendPriceTwoNights: number;
    public jacuzzi: boolean;
    public pool: boolean;
    public heated_pool: boolean;
    public indoor_pool: boolean;
    public air_conditioner: boolean;
    public wifi: boolean;
    public sauna: boolean;
    public parking: boolean;
    public images: string[] = [];
    public events: CalendarEvent[] = [];

    constructor(hutName: string, capacity: number, regularPrice: number, weekendPrice: number, regularPriceTwoNights: number,
        weekendPriceTwoNights: number, jacuzzi: boolean, pool: boolean, heated_pool: boolean, indoor_pool: boolean, 
        air_conditioner: boolean, wifi: boolean, sauna: boolean, parking: boolean){
            
        this.hutName = hutName;
        this.capacity = capacity
        this.regularPrice = regularPrice;
        this.weekendPrice = weekendPrice;
        this.regularPriceTwoNights = regularPriceTwoNights;
        this.weekendPriceTwoNights = weekendPriceTwoNights;
        this.jacuzzi = jacuzzi;
        this.pool = pool;
        this.heated_pool = heated_pool;
        this.indoor_pool = indoor_pool;
        this.air_conditioner = air_conditioner;
        this.wifi = wifi;
        this.sauna = sauna;
        this.parking = parking;
    }
}