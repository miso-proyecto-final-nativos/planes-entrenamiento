import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RutinaEntity } from './rutina.entity';
import { DeportistaEntity } from './deportista.entity';

@Entity()
export class PlanEntrenamientoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imagen?: string;

  @Column()
  suscripcion?: number;

  @Column()
  nombre: string;

  @Column()
  descripcion?: string;

  @Column()
  duracion?: string;

  @OneToMany(() => RutinaEntity, (routine) => routine.planEntrenamiento, {
    cascade: true,
  })
  rutinas?: RutinaEntity[];

  @ManyToMany(
    () => DeportistaEntity,
    (deportista) => deportista.planesEntrenamiento,
  )
  @JoinTable()
  deportistas?: DeportistaEntity[];
}
