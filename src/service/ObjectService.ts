import { AppDataSource } from "../data-source";
import { Bids } from "../entities/Bids";
import { LocatorObject } from "../entities/Object";

const LocatorRepository = AppDataSource.getRepository(LocatorObject);

export const save = async (regObject) => {
  const { locatorObjectData, bidsData } = regObject;

  let bidsDataWithDateEnd = {
    ...bidsData,
    endTime: new Date(
      new Date(bidsData.date).getTime() + bidsData.dayTime * 24 * 60 * 60 * 1000
    ),
    dateForChangePrice: new Date(
      new Date(bidsData.date).getTime() + bidsData.stepTime * 60 * 60 * 1000
    ),
    status: "Торги идут"
  };

  const bidsRepository = AppDataSource.getRepository(Bids);
  const savedBid = await bidsRepository.save(bidsDataWithDateEnd);

  // Create a new LocatorObject entity and associate it with the savedBid
  const locatorObjectRepository = AppDataSource.getRepository(LocatorObject);
  const newObject = {
    ...locatorObjectData,
    bids: savedBid.id, // Associate the Bids object with LocatorObject
  };

  return await locatorObjectRepository.save(newObject);
};

export const getAll = async () => {
  let alerts = await LocatorRepository.find({
    relations: ["bids"], // Загружаем связанные данные из таблицы Bids
  });
  return alerts;
};
