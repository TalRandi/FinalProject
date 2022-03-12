export class Order{
    zimmerName: string;
    name: string;
    phone: string;
    email: string;
    start_date: string;
    end_date: string;
    requests: string;
    hut_name: string;
    guests: number;
    order_id: string;
    isApproved: boolean;
    total_price: number;

    constructor(zimmerName: string, name: string, phone: string, email: string, start_date: string, end_date: string, requests: string,
        hut_name: string, guests: number, order_id: string, isApproved: boolean, total_price: number){
            
        this.zimmerName = zimmerName;    
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.start_date = start_date;
        this.end_date =  end_date;
        this.requests = requests;
        this.hut_name = hut_name;
        this.guests = guests; 
        this.order_id = order_id;
        this.isApproved =  isApproved;
        this.total_price = total_price;
    }

}

