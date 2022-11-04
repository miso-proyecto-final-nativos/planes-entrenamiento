import { Test, TestingModule } from '@nestjs/testing';
import { PlanesEntrenamientoService } from './planes-entrenamiento.service';

describe('PlanesEntrenamientoService', () => {
  let service: PlanesEntrenamientoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanesEntrenamientoService],
    }).compile();

    service = module.get<PlanesEntrenamientoService>(
      PlanesEntrenamientoService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
