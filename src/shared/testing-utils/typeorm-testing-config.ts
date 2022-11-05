import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntrenamientoEntity } from '../../planes-entrenamiento/entities/plan-entrenamiento.entity';
import { DeportistaEntity } from '../../planes-entrenamiento/entities/deportista.entity';
import { RutinaEntity } from '../../planes-entrenamiento/entities/rutina.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [PlanEntrenamientoEntity, RutinaEntity, DeportistaEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    PlanEntrenamientoEntity,
    RutinaEntity,
    DeportistaEntity,
  ]),
];
