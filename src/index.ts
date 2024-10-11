import express from "express";
import { AppDataSource } from "./data-source";
import cookieParser from "cookie-parser";
import { routerAuth } from "./routes/routerAuth";
import cors from 'cors';
import { routerObject } from "./routes/routerObject";
import { routerPrice } from "./routes/routerPrice";
import { CronJob } from "cron";
import { Bids } from "./entities/Bids";

const startServer = async () => {
  try {
    await AppDataSource.initialize().then(() => {
      console.log("Data Source has been initialized!")
    })

    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    }));
    app.use("/api/auth", routerAuth);
    app.use("/api/object", routerObject);
    app.use("api/price", routerPrice)

    app.listen(5000, "0.0.0.0", () => {
      console.log("All right!")
    })

    const updateAuction = async () => {
      const BidsRepository = AppDataSource.getRepository(Bids);
      let bids = await BidsRepository.find();
      // Проходим по всем записям
      for (let bid of bids) {
        // Проверяем, если dateForChangePrice меньше текущей даты
        if (bid.status == "Торги идут"){
        if (new Date(bid.dateForChangePrice) < new Date()) {
          // Приведение значений к числу
          const nowPrice = parseFloat(bid.nowPrice as unknown as string);
          const step = parseFloat(bid.step as unknown as string);
          const minimalPrice = parseFloat(bid.minimalPrice as unknown as string);
    
          // Вычисляем новое значение nowPrice
          const newPrice = nowPrice - step;
    
          // Проверяем, если новое значение nowPrice становится равным minimalPrice
          if (newPrice <= minimalPrice && bid.numberOfBets > 0) {
            // Обновляем поле nowPrice и status
            bid.nowPrice = newPrice;
            bid.status = "Торги завершены успешно";
          } else {
            // Если не достигнуто минимальное значение или нет ставок, просто обновляем поле nowPrice
            bid.nowPrice = newPrice;
            console.log("Изменили цену!")
          }

          
        }
          // Сохраняем обновленную запись
          await BidsRepository.save(bid);
        }
      }
    };
    
    const job = CronJob.from({
      cronTime: '*/5 * * * *',
      onTick: function (){ updateAuction()},
      start: true,
      timeZone: 'Europe/Minsk'
    });

  } catch (err) {
    console.error("Error during Server initialization:", err);
  }
};


startServer();

export default startServer;