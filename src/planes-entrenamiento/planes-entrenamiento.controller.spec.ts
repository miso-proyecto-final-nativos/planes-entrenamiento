import { Test, TestingModule } from '@nestjs/testing';
import { PlanesEntrenamientoController } from './planes-entrenamiento.controller';
import { PlanesEntrenamientoService } from './planes-entrenamiento.service';

describe('PlanesEntrenamientoController', () => {
  let controller: PlanesEntrenamientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanesEntrenamientoController],
      providers: [PlanesEntrenamientoService],
    }).compile();

    controller = module.get<PlanesEntrenamientoController>(
      PlanesEntrenamientoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
