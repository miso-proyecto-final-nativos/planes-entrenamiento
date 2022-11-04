import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IRoutine } from './iroutine.interface';
import { PlanEntrenamientoEntity } from './planes-entrenamiento.entity';

@Entity()
export class RoutineEntity implements IRoutine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  day: number;

  @Column()
  exercise: string;

  @ManyToOne(
    () => PlanEntrenamientoEntity,
    (planEntrenamiento) => planEntrenamiento.routines,
    {
      onDelete: 'CASCADE',
    },
  )
  planEntrenamiento: PlanEntrenamientoEntity;
}
