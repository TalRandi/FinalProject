export class Client {
    public name: string;
    public email: string;
    public points: number;
    public favorites: string[];

    constructor(name: string, email: string, points: number, favorites: string[]) {
        this.name = name;
        this.email = email;
        this.points = points;
        this.favorites = favorites;
    }
}