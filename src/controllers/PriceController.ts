import * as PriceService from "../service/PriceService";

export const setPrice = async (req, res) => {
  // const price = await PriceService.setPrice(req.body);
  // console.log(req.body)
  return res.send("Дошел!");
};

export const getPrice = async (req, res) => {
  try {
    let objects = await PriceService.getPrice(req.body);

    if (!objects) {
      throw new Error("Rifts not found!");
    }

    return res.send(objects);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

export const test = async (req, res) => {
  // const price = await PriceService.setPrice(req.body);
  // console.log(req.body)
  return res.send("Дошел!");
};
