import * as ObjectService from "../service/ObjectService";
import * as PriceService from "../service/PriceService";
export const addObject = async (req, res) => {
    await ObjectService.save(req.body);
    return res.send("Объект успешно добавлен!");
};

export const getAll = async (req, res) => {
    try {
      let objects = await ObjectService.getAll();
  
      if (!objects) {
        throw new Error("Rifts not found!");
      }
  
      return res.send(objects);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error.message);
    }
  };

  export const setPrice = async (req, res) => {
    const price = await PriceService.setPrice(req.body);
    return res.send(price);
  };
  