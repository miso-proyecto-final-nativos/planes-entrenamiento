import { Injectable } from '@nestjs/common';
import { CreatePlanesEntrenamientoDto } from './dto/create-planes-entrenamiento.dto';
import { UpdatePlanesEntrenamientoDto } from './dto/update-planes-entrenamiento.dto';

@Injectable()
export class PlanesEntrenamientoService {
  create(createPlanesEntrenamientoDto: CreatePlanesEntrenamientoDto) {
    return 'This action adds a new planesEntrenamiento';
  }

  findAll() {
    return `This action returns all planesEntrenamiento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planesEntrenamiento`;
  }

  update(
    id: number,
    updatePlanesEntrenamientoDto: UpdatePlanesEntrenamientoDto,
  ) {
    return `This action updates a #${id} planesEntrenamiento`;
  }

  remove(id: number) {
    return `This action removes a #${id} planesEntrenamiento`;
  }
}
