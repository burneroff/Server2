import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Bids {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: true })
    date: Date;
    
    @Column({ nullable: true })
    dayTime: string;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    endTime: Date;

    @Column({ nullable: true })
    stepTime: string;
    
    @Column({ nullable: true })
    basicPrice: number;

    @Column({ nullable: true })
    nowPrice: number;

    @Column({ nullable: true })
    minimalPrice: number;

    @Column({ nullable: true })
    step: number;

    @Column({ nullable: true })
    bonus: number;
    
    @Column({ nullable: true })
    numberOfBets: number;

    @Column({ nullable: true })
    dateForChangePrice: Date;

    @Column({ nullable: true })
    person: string;
}