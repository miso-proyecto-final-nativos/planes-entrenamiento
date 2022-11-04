import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanesEntrenamientoDto } from './create-planes-entrenamiento.dto';

export class UpdatePlanesEntrenamientoDto extends PartialType(
  CreatePlanesEntrenamientoDto,
) {}
