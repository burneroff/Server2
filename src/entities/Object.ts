import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Bids } from "./Bids";

@Entity()
export class LocatorObject {
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    type_ad: string;

    @Column({ nullable: true })
    type_object: string;

    @Column({ nullable: true })
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