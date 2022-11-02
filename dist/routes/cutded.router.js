"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutdedRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const database_service_1 = require("../services/database.service");
// import REVIEW from "../models/review"
const rating_1 = require("../rating");
//import { isConstructorDeclaration, isConstructorTypeNode } from "typescript";
// Global Config
exports.cutdedRouter = express_1.default.Router();
exports.cutdedRouter.use(express_1.default.json());
// GET
exports.cutdedRouter.get("/food", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foods = (yield database_service_1.collections.food.find({}).toArray());
        res.status(200).send(foods);
    }
    catch (error) {
        if (error instanceof mongodb_1.MongoError) {
            res.status(500).send(error.message);
            return;
        }
        else {
            res.status(500).send("unknown error");
            return;
        }
    }
}));
exports.cutdedRouter.get("/review", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foodsreview = (yield database_service_1.collections.review.find({}).toArray());
        res.status(200).send(foodsreview);
    }
    catch (error) {
        if (error instanceof mongodb_1.MongoError) {
            res.status(500).send(error.message);
            return;
        }
        else {
            res.status(500).send("unknown error");
            return;
        }
    }
}));
exports.cutdedRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    const query = { _id: new mongodb_1.ObjectId(id) };
}));
// POST
exports.cutdedRouter.post("/food", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newFood = req.body;
        const result = yield database_service_1.collections.food.insertOne(newFood);
        result
            ? res.status(201).send(`Successfully created a new food with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new food.");
    }
    catch (error) {
        if (error instanceof mongodb_1.MongoError) {
            res.status(400).send(error.message);
            return;
        }
        else {
            res.status(400).send("unknown error");
            return;
        }
    }
}));
exports.cutdedRouter.post("/review", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newReview = req.body;
        const result = yield database_service_1.collections.review.insertOne(newReview);
        result
            ? res.status(201).send(`Successfully created a new food with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new food.");
    }
    catch (error) {
        if (error instanceof mongodb_1.MongoError) {
            res.status(400).send(error.message);
            return;
        }
        else {
            res.status(400).send("unknown error");
            return;
        }
    }
}));
// PUT
exports.cutdedRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const id = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
    try {
        const updatedCutded = req.body;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield database_service_1.collections.food.updateOne(query, { $set: updatedCutded });
        result
            ? res.status(200).send(`Successfully updated food with id ${id}`)
            : res.status(304).send(`Food with id: ${id} not updated`);
    }
    catch (error) {
        if (error instanceof mongodb_1.MongoError) {
            res.status(400).send(error.message);
            return;
        }
        else {
            res.status(400).send("unknown error");
            return;
        }
    }
}));
// DELETE
exports.cutdedRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const id = (_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield database_service_1.collections.food.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed food with id ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove food with id ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Food with id ${id} does not exist`);
        }
    }
    catch (error) {
        if (error instanceof mongodb_1.MongoError) {
            res.status(400).send(error.message);
            return;
        }
        else {
            res.status(400).send("unknown error");
            return;
        }
    }
}));
//UPDATERATING
exports.cutdedRouter.post("/rating", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        console.log(req.body);
        // Save review
        yield database_service_1.collections.review.insertOne(req.body);
        // Query food
        const id = req.body;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const datfood = yield ((_d = database_service_1.collections.food) === null || _d === void 0 ? void 0 : _d.findOne(query));
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
        datfood.rating = (0, rating_1.calcRating)(datfood.rating, req.body.rating, datfood.nresponse);
        datfood.nresponse += 1;
        yield ((_e = database_service_1.collections.food) === null || _e === void 0 ? void 0 : _e.replaceOne(query, datfood));
        res.status(201).send("created!");
        return;
    }
    catch (error) {
        if (error instanceof mongodb_1.MongoError) {
            res.status(400).send(error.message);
            return;
        }
        else {
            res.status(400).send("unknown error");
            return;
        }
    }
}));
//# sourceMappingURL=cutded.router.js.map