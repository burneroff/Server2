import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Bids } from "./Bids";

@Entity()
export class LocatorObject {
    @PrimaryColumn()
    id: string;

    @Column()
    type_ad: string;

    @Column()
    type_object: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    date: Date;

    @Column({ nullable: true })
    adTitle: string;

    @Column({ nullable: true })
    adDescription: string;

    @Column({ nullable: true })
    is_express: boolean;

    @OneToOne(() => Bids)
    @JoinColumn()
    bids: Bids;  // Store a reference to the Bids object
}