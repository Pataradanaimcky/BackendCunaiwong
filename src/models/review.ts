// External dependencies
import { ObjectId } from "mongodb";
// Class Implementation
export default class REVIEW {
    constructor(public userwhocomment: string,
                public ratingnow: number,
                public Sumrating: number,
                public allrating: number,
                public Oldrating: number,
                public description: string,
                public id?: ObjectId) {}
}