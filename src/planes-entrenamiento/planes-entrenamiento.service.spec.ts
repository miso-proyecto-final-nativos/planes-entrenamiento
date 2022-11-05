import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PlanEntrenamientoEntity } from './entities/plan-entrenamiento.entity';
import { RutinaEntity } from './entities/rutina.entity';
import { PlanesEntrenamientoService } from './planes-entrenamiento.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeportistaEntity } from './entities/deportista.entity';
import { faker } from '@faker-js/faker';

describe('PlanesEntrenamientoService', () => {
  let service: PlanesEntrenamientoService;
  let planEntrenamientoRepository: Repository<PlanEntrenamientoEntity>;
  let rutinaRepository: Repository<RutinaEntity>;
  let deportistaRepository: Repository<DeportistaEntity>;
  let planesEntrenamientoList: PlanEntrenamientoEntity[];
  const deportistaId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PlanesEntrenamientoService],
    }).compile();

    service = module.get<PlanesEntrenamientoService>(
      PlanesEntrenamientoService,
    );
    planEntrenamientoRepository = module.get<
      Repository<PlanEntrenamientoEntity>
    >(getRepositoryToken(PlanEntrenamientoEntity));
    rutinaRepository = module.get<Repository<RutinaEntity>>(
      getRepositoryToken(RutinaEntity),
    );
    deportistaRepository = module.get<Repository<DeportistaEntity>>(
      getRepositoryToken(DeportistaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    planEntrenamientoRepository.clear();
    rutinaRepository.clear();
    deportistaRepository.clear();
    planesEntrenamientoList = [];
    for (let i = 0; i < 5; i++) {
      const rutinasList: RutinaEntity[] = [];
      for (let i = 0; i < 5; i++) {
        const rutina: RutinaEntity = await rutinaRepository.save({
          dia: faker.datatype.number(30),
          ejercicio: faker.lorem.sentence(5),
        });
        rutinasList.push(rutina);
      }
      const planEntrenamiento = await planEntrenamientoRepository.save({
        nombre: faker.commerce.productName(),
        descripcion: faker.commerce.productDescription(),
        duracion: faker.commerce.productAdjective(),
        imagen: faker.image.imageUrl(),
        suscripcion: faker.datatype.number(10),
        rutinas: rutinasList,
      });
      planesEntrenamientoList.push(planEntrenamiento);
    }
  };

  it('El servicio de planes de entrenamiento debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('obtenerTodos debe retornar todos los planes de entrenamiento registrados', async () => {
    const planesEntrenamiento: PlanEntrenamientoEntity[] =
      await service.obtenerTodos();
    expect(planesEntrenamiento).not.toBeNull();
    expect(planesEntrenamiento).toHaveLength(planesEntrenamientoList.length);
  });

  it('obtenerPlanesSugeridosDeportista debe retornar planes de entrenamiento sugeridos para un deportista', async () => {
    const planesEntrenamientoSugeridos: PlanEntrenamientoEntity[] =
      await service.obtenerPlanesSugeridosDeportista(deportistaId);
    expect(planesEntrenamientoSugeridos).not.toBeNull();
    expect(planesEntrenamientoSugeridos.length).toBeLessThanOrEqual(
      planesEntrenamientoList.length,
    );
  });

  it('obtenerPlanesRegistradosDeportista debe retornar planes de entrenamiento registrados por un deportista', async () => {
    await service.adicionarPlanEntrenamientoDeportista(
      planesEntrenamientoList[0].id,
      deportistaId,
    );
    await service.adicionarPlanEntrenamientoDeportista(
      planesEntrenamientoList[1].id,
      deportistaId,
    );
    const planesEntrenamientoRegistrados: PlanEntrenamientoEntity[] =
      await service.obtenerPlanesRegistradosDeportista(deportistaId);
    expect(planesEntrenamientoRegistrados).not.toBeNull();
    expect(planesEntrenamientoRegistrados.length).toEqual(2);
  });

  it('obtenerPlanesRegistradosDeportista debe lanzar una excepción cuando el deportista no tiene planes de entrenamiento registrados', async () => {
    await expect(() =>
      service.obtenerPlanesRegistradosDeportista(deportistaId),
    ).rejects.toHaveProperty(
      'message',
      'El deportista con el id suministrado no ha registrado planes de entrenamiento',
    );
  });

  it('adicionarPlanEntrenamientoDeportista debe permitir que un usuario registre un plan de entrenamiento', async () => {
    await service.adicionarPlanEntrenamientoDeportista(
      planesEntrenamientoList[0].id,
      deportistaId,
    );
    const planesEntrenamientoRegistrados: PlanEntrenamientoEntity[] =
      await service.obtenerPlanesRegistradosDeportista(deportistaId);
    expect(planesEntrenamientoRegistrados).not.toBeNull();
    expect(planesEntrenamientoRegistrados.length).toEqual(1);
    expect(planesEntrenamientoRegistrados[0].id).toEqual(
      planesEntrenamientoList[0].id,
    );
  });

  it('adicionarPlanEntrenamientoDeportista debe lanzar una excepción para un plan que no exista en el sistema', async () => {
    await expect(() =>
      service.adicionarPlanEntrenamientoDeportista('-1', deportistaId),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un plan de entrenamiento con el id suministrado',
    );
  });

  it('obtenerPlanEntrenamiento debe retornar un plan de entrenamiento', async () => {
    const planEntrenamiento: PlanEntrenamientoEntity =
      await service.obtenerPlanEntrenamiento(planesEntrenamientoList[0].id);
    expect(planEntrenamiento).not.toBeNull();
    expect(planEntrenamiento.nombre).toEqual(planesEntrenamientoList[0].nombre);
    expect(planEntrenamiento.descripcion).toEqual(
      planesEntrenamientoList[0].descripcion,
    );
    expect(planEntrenamiento.duracion).toEqual(
      planesEntrenamientoList[0].duracion,
    );
    expect(planEntrenamiento.imagen).toEqual(planesEntrenamientoList[0].imagen);
    expect(planEntrenamiento.suscripcion).toEqual(
      planesEntrenamientoList[0].suscripcion,
    );
    expect(planEntrenamiento.rutinas).toEqual(
      planesEntrenamientoList[0].rutinas,
    );
  });

  it('obtenerPlanEntrenamiento debe lanzar una excepción para un plan de entrenamiento que no exista en el sistema', async () => {
    await expect(() =>
      service.obtenerPlanEntrenamiento('-1'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un plan de entrenamiento con el id suministrado',
    );
  });

  it('crear debe almacenar un nuevo plan de entrenamiento', async () => {
    const rutinasList: RutinaEntity[] = [];
    for (let i = 0; i < 5; i++) {
      const rutina: RutinaEntity = await rutinaRepository.save({
        dia: faker.datatype.number(30),
        ejercicio: faker.lorem.sentence(5),
      });
      rutinasList.push(rutina);
    }
    let planEntrenamientoNuevo: PlanEntrenamientoEntity = {
      id: '',
      nombre: faker.commerce.productName(),
      descripcion: faker.commerce.productDescription(),
      duracion: faker.commerce.productAdjective(),
      imagen: faker.image.imageUrl(),
      suscripcion: faker.datatype.number(10),
      rutinas: rutinasList,
    };

    planEntrenamientoNuevo = await service.crear(planEntrenamientoNuevo);
    expect(planEntrenamientoNuevo).not.toBeNull();

    const planEntrenamientoAlmacenado: PlanEntrenamientoEntity =
      await service.obtenerPlanEntrenamiento(planEntrenamientoNuevo.id);
    expect(planEntrenamientoAlmacenado).not.toBeNull();
    expect(planEntrenamientoAlmacenado.nombre).toEqual(
      planEntrenamientoNuevo.nombre,
    );
    expect(planEntrenamientoAlmacenado.descripcion).toEqual(
      planEntrenamientoNuevo.descripcion,
    );
    expect(planEntrenamientoAlmacenado.duracion).toEqual(
      planEntrenamientoNuevo.duracion,
    );
    expect(planEntrenamientoAlmacenado.imagen).toEqual(
      planEntrenamientoNuevo.imagen,
    );
    expect(planEntrenamientoAlmacenado.suscripcion).toEqual(
      planEntrenamientoNuevo.suscripcion,
    );
    expect(planEntrenamientoAlmacenado.rutinas).toEqual(
      planEntrenamientoNuevo.rutinas,
    );
  });

  it('actualizar debe permitir actualizar los datos de un plan de entrenamiento', async () => {
    const rutinasList: RutinaEntity[] = [];
    const planEntrenamiento: PlanEntrenamientoEntity =
      planesEntrenamientoList[0];
    planEntrenamiento.nombre = faker.commerce.productName();
    planEntrenamiento.descripcion = faker.commerce.productDescription();
    planEntrenamiento.duracion = faker.commerce.productAdjective();
    planEntrenamiento.imagen = faker.image.imageUrl();
    planEntrenamiento.suscripcion = faker.datatype.number(10);
    for (let i = 0; i < 5; i++) {
      const rutina: RutinaEntity = await rutinaRepository.save({
        dia: faker.datatype.number(30),
        ejercicio: faker.lorem.sentence(5),
      });
      rutinasList.push(rutina);
    }
    planEntrenamiento.rutinas = rutinasList;
    const planEntrenamientoActualizado = await service.actualizar(
      planEntrenamiento.id,
      planEntrenamiento,
    );
    expect(planEntrenamientoActualizado).not.toBeNull();
    const planEntrenamientoAlmacenado: PlanEntrenamientoEntity =
      await service.obtenerPlanEntrenamiento(planEntrenamiento.id);
    expect(planEntrenamientoAlmacenado).not.toBeNull();
    expect(planEntrenamientoAlmacenado.nombre).toEqual(
      planEntrenamientoActualizado.nombre,
    );
    expect(planEntrenamientoAlmacenado.descripcion).toEqual(
      planEntrenamientoActualizado.descripcion,
    );
    expect(planEntrenamientoAlmacenado.duracion).toEqual(
      planEntrenamientoActualizado.duracion,
    );
    expect(planEntrenamientoAlmacenado.imagen).toEqual(
      planEntrenamientoActualizado.imagen,
    );
    expect(planEntrenamientoAlmacenado.suscripcion).toEqual(
      planEntrenamientoActualizado.suscripcion,
    );
    expect(planEntrenamientoAlmacenado.rutinas).toEqual(
      planEntrenamientoActualizado.rutinas,
    );
  });

  it('actualizar debe lanzar una excepción para un plan de entrenamiento que no exista en el sistema', async () => {
    const planEntrenamiento: PlanEntrenamientoEntity =
      planesEntrenamientoList[0];
    planEntrenamiento.nombre = faker.commerce.productName();
    planEntrenamiento.descripcion = faker.commerce.productDescription();
    planEntrenamiento.duracion = faker.commerce.productAdjective();
    planEntrenamiento.imagen = faker.image.imageUrl();
    planEntrenamiento.suscripcion = faker.datatype.number(10);
    await expect(() =>
      service.actualizar('-1', planEntrenamiento),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un plan de entrenamiento con el id suministrado',
    );
  });

  it('eliminar elimina un plan de entrenamiento del sistema', async () => {
    await service.eliminar(planesEntrenamientoList[0].id);
    await expect(() =>
      service.obtenerPlanEntrenamiento(planesEntrenamientoList[0].id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un plan de entrenamiento con el id suministrado',
    );
  });

  it('eliminar debe lanzar una excepción para un plan de entrenamiento que no exista en el sistema', async () => {
    await expect(() => service.eliminar('-1')).rejects.toHaveProperty(
      'message',
      'No se encontró un plan de entrenamiento con el id suministrado',
    );
  });

  it('eliminarPlanEntrenamientoDeportista debe eliminar un plan de entrenamiento asociado a un deportista', async () => {
    await service.adicionarPlanEntrenamientoDeportista(
      planesEntrenamientoList[0].id,
      deportistaId,
    );
    await service.eliminarPlanEntrenamientoDeportista(
      planesEntrenamientoList[0].id,
      deportistaId,
    );
    const planesEntrenamiento =
      await service.obtenerPlanesRegistradosDeportista(deportistaId);
    expect(planesEntrenamiento.length).toEqual(0);
  });

  it('eliminarPlanEntrenamientoDeportista debe lanzar una excepción para un deportista que no ha registrado planes de entrenamiento', async () => {
    await expect(() =>
      service.eliminarPlanEntrenamientoDeportista(
        planesEntrenamientoList[0].id,
        deportistaId,
      ),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un deportista con el id suministrado',
    );
  });

  it('eliminarPlanEntrenamientoDeportista debe lanzar una excepción para un plan de entrenamiento que no existe', async () => {
    await service.adicionarPlanEntrenamientoDeportista(
      planesEntrenamientoList[0].id,
      deportistaId,
    );
    await expect(() =>
      service.eliminarPlanEntrenamientoDeportista('-1', deportistaId),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un plan de entrenamiento con el id suministrado',
    );
  });

  it('eliminarPlanEntrenamientoDeportista debe lanzar una excepción para un plan de entrenamiento que no ha sido asociado a un deportista', async () => {
    await service.adicionarPlanEntrenamientoDeportista(
      planesEntrenamientoList[0].id,
      deportistaId,
    );
    await expect(() =>
      service.eliminarPlanEntrenamientoDeportista(
        planesEntrenamientoList[1].id,
        deportistaId,
      ),
    ).rejects.toHaveProperty(
      'message',
      `El deportista con el id suministrado no ha registrado el plan de entremaniento ${planesEntrenamientoList[1].nombre}`,
    );
  });
});
