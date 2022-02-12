import { Zimmer } from "../shared-data/zimmer.model";

export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date,
        public admin: boolean,
        public zimmer: Zimmer,
    ){}

    get token(){
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return null;
        }
        return this._token;
    }
}