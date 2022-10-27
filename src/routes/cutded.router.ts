// External Dependencies
//import cors for frontend dev
import cors from "cors"
import express, { Request, Response } from "express";
import { Db, MongoError, ObjectId } from "mongodb";
import {collections} from"../services/database.service";
import FOOD from "../models/FOOD";
// import REVIEW from "../models/review"
import { calcRating } from "../rating";
import REVIEW from "../models/review";
//import { isConstructorDeclaration, isConstructorTypeNode } from "typescript";
// Global Config
export const cutdedRouter = express.Router();

cutdedRouter.use(express.json());
// GET
cutdedRouter.get("/food", async (_req: Request, res: Response) => {
    try {
       const foods = (await collections.food!.find({}).toArray());

        res.status(200).send(foods);
    } catch (error) {
        if (error instanceof MongoError){
            res.status(500).send(error.message);
            return;
        }     
        else{
            res.status(500).send("unknown error");
            return;
        }
    }
});
cutdedRouter.get("/review", async (_req: Request, res: Response) => {
    try {
       const foodsreview = (await collections.review!.find({}).toArray());

        res.status(200).send(foodsreview);
    } catch (error) {
        if (error instanceof MongoError){
            res.status(500).send(error.message);
            return;
        }     
        else{
            res.status(500).send("unknown error");
            return;
        }
    }
});
cutdedRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    const query = { _id: new ObjectId(id) };
})
// POST
cutdedRouter.post("/food", async (req: Request, res: Response) => {
    try {
        const newFood = req.body as FOOD;
        const result = await collections.food!.insertOne(newFood);

        result
            ? res.status(201).send(`Successfully created a new food with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new food.");
        } catch (error) {
            if (error instanceof MongoError){
                res.status(400).send(error.message);
                return;
            }     
            else{
                res.status(400).send("unknown error");
                return;
        }
    }
});
cutdedRouter.post("/review", async (req: Request, res: Response) => {
    try {
        const newReview = req.body as REVIEW;
        const result = await collections.review!.insertOne(newReview);

        result
            ? res.status(201).send(`Successfully created a new food with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new food.");
        } catch (error) {
            if (error instanceof MongoError){
                res.status(400).send(error.message);
                return;
            }     
            else{
                res.status(400).send("unknown error");
                return;
        }
    }
});
// PUT
cutdedRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedCutded: FOOD = req.body as FOOD;
        const query = { _id: new ObjectId(id) };
      
        const result = await collections.food!.updateOne(query, { $set: updatedCutded });

        result
            ? res.status(200).send(`Successfully updated food with id ${id}`)
            : res.status(304).send(`Food with id: ${id} not updated`);
    } catch (error) {
        if (error instanceof MongoError){
            res.status(400).send(error.message);
            return;
        }     
        else{
            res.status(400).send("unknown error");
            return;
    }
}})
// DELETE
cutdedRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.food!.deleteOne(query);
        
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed food with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove food with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Food with id ${id} does not exist`);
        }
    } catch (error) {
        if (error instanceof MongoError){
            res.status(400).send(error.message);
            return;
        }     
        else{
            res.status(400).send("unknown error");
            return;
        }
    }
})
//UPDATERATING
cutdedRouter.post("/rating", async (req: Request, res: Response) => {
    try {
      console.log(req.body);
  
      // Save review
      await collections.review!.insertOne(req.body);
  
      // Query food
      const id = req.body;
      const query = { _id: new ObjectId(id) };
      const datfood = await collections.food?.findOne(query);
  
      // Check if food exists
      if (!datfood) {
        res.status(400).send(`Food with id ${id} does not exist`);
        return;
      }
  
      if (req.body.rating > 5 || req.body.rating < 0) {
        res.status(400).send(`Rating must be between 0 and 5`);
        return;
      }
  
      // Update food rating
      datfood.rating = calcRating(
        datfood.rating,
        req.body.rating,
        datfood.nresponse
      );
      datfood.nresponse += 1;
      await collections.food?.replaceOne(query, datfood);
  
      res.status(201).send("created!");
      return;
    } catch (error) {
      if (error instanceof MongoError) {
        res.status(400).send(error.message);
        return;
      } else {
        res.status(400).send("unknown error");
        return;
      }
    }
  });
