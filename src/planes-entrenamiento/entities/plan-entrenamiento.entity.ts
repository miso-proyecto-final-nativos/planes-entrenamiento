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

export enum Suscripcion {
  FREE = 'free',
  INTERMEDIATE = 'intermediate',
  PRO = 'pro',
}

@Entity()
export class PlanEntrenamientoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imagen?: string;

  @Column({
    type: 'enum',
    enum: Suscripcion,
    default: Suscripcion.FREE,
  })
  suscripcion?: Suscripcion;

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

  @ManyToMany(() => DeportistaEntity, (deportista) => deportista.planesEntrenamiento)
  @JoinTable()
  deportistas?: DeportistaEntity[];
}
