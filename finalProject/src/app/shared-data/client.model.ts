import { Order } from "./order.model";
import { Zimmer } from "./zimmer.model";

export class Client {
    public name: string;
    public email: string;
    public points: number;
    public favorites: Zimmer[];
    public orders: Order[];

    constructor(name: string, email: string, points: number, favorites: Zimmer[], orders: Order[]) {
        this.name = name;
        this.email = email;
        this.points = points;
        this.favorites = favorites;
        this.orders = orders;
    }
}