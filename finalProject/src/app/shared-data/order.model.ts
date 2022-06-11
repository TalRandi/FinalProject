export class Order{
    zimmerName: string;
    zimmerOwnerEmail: string;
    name: string;
    phone: string;
    email: string;
    start_date: string;
    end_date: string;
    book_time: Date;
    requests: string;
    hut_name: string;
    guests: number;
    order_id: string;
    isApproved: boolean;
    isRated: boolean;
    total_price: number;
    points_used: number;

    constructor(zimmerName: string, zimmerOwnerEmail: string, name: string, phone: string, email: string, start_date: string, end_date: string, requests: string,
        hut_name: string, guests: number, order_id: string, isApproved: boolean, isRated: boolean, total_price: number, points_used: number){
            
        this.zimmerName = zimmerName;    
        this.zimmerOwnerEmail = zimmerOwnerEmail;   
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.start_date = start_date;
        this.end_date =  end_date;
        this.book_time = new Date()
        this.requests = requests;
        this.hut_name = hut_name;
        this.guests = guests; 
        this.order_id = order_id;
        this.isApproved =  isApproved;
        this.isRated = isRated;
        this.total_price = total_price;
        this.points_used = points_used;
    }

}

