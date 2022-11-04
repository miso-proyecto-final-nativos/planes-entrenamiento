import { Module } from '@nestjs/common';
import { PlanesEntrenamientoService } from './planes-entrenamiento.service';
import { PlanesEntrenamientoController } from './planes-entrenamiento.controller';

@Module({
  controllers: [PlanesEntrenamientoController],
  providers: [PlanesEntrenamientoService],
})
export class PlanesEntrenamientoModule {}
