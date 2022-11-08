import {
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Entity,
} from "typeorm";
import ScheduledClass from "./ScheduledClass";

@Entity()
export default class FitnessClass extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  duration: number;

  @Column()
  level: string;

  @Column()
  available_spots: number;

  @OneToMany(
    () => ScheduledClass,
    (scheduledClass) => scheduledClass.fitnessClass
  )
  scheduledClasses: ScheduledClass[];
}
