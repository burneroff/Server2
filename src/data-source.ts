import "reflect-metadata"
import { DataSource } from "typeorm"


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432, // PostgreSQL default port
    username: 'postgres',
    password: '17080290',
    database: 'locator',

    synchronize: true,
    logging: false,
    entities: ['src/entities/*.ts'],
});


