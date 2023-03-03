import {
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Entity,
} from "typeorm";
import ScheduledClass from "./ScheduledClass";

@Entity()
export default class Location extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({
    nullable: true,
    type: "decimal",
  })
  lat: number;

  @Column({
    nullable: true,
    type: "decimal",
  })
  lng: number;

  @OneToMany(
    () => ScheduledClass,
    (scheduledClass) => scheduledClass.location,
    { onDelete: "CASCADE" }
  )
  scheduledClasses: ScheduledClass[];
}
