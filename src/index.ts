import express from "express";
import { AppDataSource } from "./data-source";
import cookieParser from "cookie-parser";
import { routerAuth } from "./routes/routerAuth";
import cors from 'cors';
import { routerObject } from "./routes/routerObject";
import { routerPrice } from "./routes/routerPrice";
import { CronJob } from "cron";
import { Bids } from "./entities/Bids";
import next from 'next';

// Настройки Next.js
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const startServer = async () => {
  try {
    await AppDataSource.initialize().then(() => {
      console.log("Data Source has been initialized!")
    });

    await nextApp.prepare(); // Подготовка Next.js приложения

    const app = express();
    
    // Middlewares
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
      origin: ['http://localhost:3000'], // разрешённый фронтенд
      credentials: true,
    }));

    // API маршруты
    app.use("/api/auth", routerAuth);
    app.use("/api/object", routerObject);
    app.use("/api/price", routerPrice);

    // Cron-задача для обновления аукционов
    const updateAuction = async () => {
      const BidsRepository = AppDataSource.getRepository(Bids);
      let bids = await BidsRepository.find();
      
      for (let bid of bids) {
        if (bid.status === "Торги идут") {
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

            // Сохраняем обновления
            await BidsRepository.save(bid);
          }
        }
      }
    };
    
    const job = new CronJob('*/5 * * * *', updateAuction, null, true, 'Europe/Minsk');
    job.start();

    // Обработка всех остальных маршрутов через Next.js
    app.all('*', (req, res) => {
      return handle(req, res);
    });

    // Запуск сервера
    app.listen(5000, () => {
      console.log("Сервер запущен на http://localhost:5000");
    });

  } catch (err) {
    console.error("Ошибка при инициализации сервера:", err);
  }
};

startServer();

export default startServer;
