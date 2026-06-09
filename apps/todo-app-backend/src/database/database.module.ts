import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: process.env.DATABASE_URL ?? 'db.sqlite',
            autoLoadEntities: true,
            synchronize: true,
        })
    ]
})
export class DatabaseModule { }