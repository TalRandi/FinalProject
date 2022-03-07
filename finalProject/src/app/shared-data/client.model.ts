import { Order } from "./order.model";

export class Client {
    public name: string;
    public email: string;
    public points: number;
    public favorites: string[];
    public orders: Order[];

    constructor(name: string, email: string, points: number, favorites: string[], orders: Order[]) {
        this.name = name;
        this.email = email;
        this.points = points;
        this.favorites = favorites;
        this.orders = orders;
    }
}