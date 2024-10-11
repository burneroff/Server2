import * as express from "express";
import * as ObjectController from "../controllers/ObjectController"

export const routerObject = express.Router();
 
routerObject.post("/addObject", ObjectController.addObject);
routerObject.post("/setPrice", ObjectController.setPrice);
routerObject.get("/getAll", ObjectController.getAll);