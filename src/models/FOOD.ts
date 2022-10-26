// External dependencies
import { ObjectId } from "mongodb";
// Class Implementation
export default class Food {
    constructor(public restaurant: string,
                public name: string, 
                public price: number, 
                public category: string, 
                public Meanrating: number,
                public faculty: string,
                public nresponse: number,
                public comment: string,
                public id?: ObjectId) {}
}