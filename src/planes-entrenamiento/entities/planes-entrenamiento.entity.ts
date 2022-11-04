import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoutineEntity } from './routine.entity';

export enum Subscription {
  FREE = 'free',
  INTERMEDIATE = 'intermediate',
  PRO = 'pro',
}

@Entity()
export class PlanEntrenamientoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image?: string;

  @Column({
    type: 'enum',
    enum: Subscription,
    default: Subscription.FREE,
  })
  subscription?: Subscription;

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column()
  duration?: string;

  @OneToMany(() => RoutineEntity, (routine) => routine.planEntrenamiento, {
    cascade: true,
  })
  routines?: RoutineEntity[];
}
