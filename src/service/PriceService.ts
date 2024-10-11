import { AppDataSource } from "../data-source";
import { Bids } from "../entities/Bids";
import { LocatorObject } from "../entities/Object";

const LocatorRepository = AppDataSource.getRepository(LocatorObject);
const BidsRepository = AppDataSource.getRepository(Bids);

export const setPrice = async (object) => {
  // Находим объект по ID
  let bids = await BidsRepository.findOneBy({ id: object.id });
  
  if(bids.person == object.person){
    return {
      status: "Вы лидируете! Если выше вашей ставки не будет, когда закончится аукцион - вы победите!",
      updatedPrice: bids.nowPrice,
      dateForChangePrice: bids.dateForChangePrice,
    }
  }
  // Проверяем, найден ли объект
  if (!bids) {
    throw new Error("Object not found");
  }

  // Вычисляем новую цену
  let updatedPrice = bids.nowPrice + bids.step;
  const date = new Date(Date.now() + 1 * 60 * 60 * 1000);

  // Обновляем только необходимые поля
  bids.nowPrice = updatedPrice;
  bids.dateForChangePrice = date;
  bids.numberOfBets = bids.numberOfBets + 1;
  bids.person = object.person;
  // Сохраняем изменения в базе данных
  await BidsRepository.save(bids);

  return {
    status: undefined,
    updatedPrice: updatedPrice,
    dateForChangePrice: date,
  };
};

export const getPrice = async (id) => {
  return 1;
  //   let alert = await LocatorRepository.findOneBy({id: id});
  //   return alert?.nowPrice;
};
