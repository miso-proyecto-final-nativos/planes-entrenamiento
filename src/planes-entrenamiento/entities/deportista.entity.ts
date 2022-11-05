import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { PlanEntrenamientoEntity } from './plan-entrenamiento.entity';

@Entity()
export class DeportistaEntity {
  @PrimaryColumn()
  id: number;

  @ManyToMany(
    () => PlanEntrenamientoEntity,
    (planEntrenamiento) => planEntrenamiento.deportistas,
  )
  planesEntrenamiento?: PlanEntrenamientoEntity[];
}
