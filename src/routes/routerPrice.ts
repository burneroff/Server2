import * as express from "express";
import * as PriceController from "../controllers/PriceController"
export const routerPrice = express.Router();
 
routerPrice.get("/getNowPrice/:id", PriceController.getPrice);
routerPrice.get("/setPrice", PriceController.setPrice);
routerPrice.get("/test", PriceController.setPrice);