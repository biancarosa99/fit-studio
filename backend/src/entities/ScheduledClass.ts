import {
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Entity,
  Timestamp,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import Appointment from "./Appointment";
import FitnessClass from "./FitnessClass";
import Location from "./Location";
import User from "./User";

@Entity()
export default class ScheduledClass extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamptz" })
  date: Date;

  @Column()
  max_spots: number;

  @OneToMany(() => Appointment, (appointment) => appointment.scheduledClass, {
    onDelete: "CASCADE",
  })
  appointments: Appointment[];

  @ManyToOne(() => FitnessClass, (fitnessClass) => fitnessClass, {
    eager: true,
  })
  fitnessClass: FitnessClass;

  @ManyToOne(() => Location, (location) => location, { eager: true })
  location: Location;

  @ManyToOne(() => User, (user) => user, { eager: true })
  @JoinColumn()
  trainer: User;
}
