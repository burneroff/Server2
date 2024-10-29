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
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    
    app.use(cors({
      origin: ['https://locatorcost.vercel.app', 'http://localhost:3000'], // Укажите разрешенный источник
      credentials: true, // Разрешите учетные данные
    }));

    app.use("/api/auth", routerAuth);
    app.use("/api/object", routerObject);
    app.use("/api/price", routerPrice);

    // Простой маршрут для проверки состояния
    app.get('/health', (req, res) => {
      res.send('OK');
    });

    app.listen(5000, "0.0.0.0", () => {
      console.log("Connected on port 5000!");
    });

    const updateAuction = async () => {
      const BidsRepository = AppDataSource.getRepository(Bids);
      let bids = await BidsRepository.find();

      for (let bid of bids) {
        if (bid.status == "Торги идут") {
          if (new Date(bid.dateForChangePrice) < new Date()) {
            const nowPrice = parseFloat(bid.nowPrice as unknown as string);
            const step = parseFloat(bid.step as unknown as string);
            const minimalPrice = parseFloat(bid.minimalPrice as unknown as string);
            const newPrice = nowPrice - step;

            if (newPrice <= minimalPrice && bid.numberOfBets > 0) {
              bid.nowPrice = newPrice;
              bid.status = "Торги завершены успешно";
            } else {
              bid.nowPrice = newPrice;
              console.log("Изменили цену!");
            }
          }
          await BidsRepository.save(bid);
        }
      }
    };
    
    // const job = new CronJob('*/5 * * * *', updateAuction, null, true, 'Europe/Minsk');

  } catch (err) {
    console.error("Error during Server initialization:", err);
  }
};

startServer();

export default startServer;
