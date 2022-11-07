import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PlanEntrenamientoEntity } from './entities/plan-entrenamiento.entity';
import { RutinaEntity } from './entities/rutina.entity';
import { DeportistaEntity } from './entities/deportista.entity';

@Injectable()
export class PlanesEntrenamientoService {
  constructor(
    @InjectRepository(PlanEntrenamientoEntity)
    private readonly planEntrenamientoRepository: Repository<PlanEntrenamientoEntity>,
    @InjectRepository(RutinaEntity)
    private readonly rutinaRepository: Repository<RutinaEntity>,
    @InjectRepository(DeportistaEntity)
    private readonly deportistaRepository: Repository<DeportistaEntity>,
  ) {}

  async obtenerTodos(): Promise<PlanEntrenamientoEntity[]> {
    return await this.planEntrenamientoRepository.find({
      relations: ['rutinas'],
    });
  }

  async obtenerPlanesSugeridosDeportista(
    deportistaId: number,
  ): Promise<PlanEntrenamientoEntity[]> {
    const planesEntrenamientoValidos: PlanEntrenamientoEntity[] = [];
    const planesEntrenamiento: PlanEntrenamientoEntity[] =
      await this.planEntrenamientoRepository.find({
        relations: ['rutinas', 'deportistas'],
      });
    planesEntrenamiento.forEach((planEntrenamiento) => {
      const deportistaPlanEntrenamiento = planEntrenamiento.deportistas.find(
        (deportista) => {
          return deportista.id == deportistaId;
        },
      );
      if (!deportistaPlanEntrenamiento) {
        delete planEntrenamiento.deportistas;
        planesEntrenamientoValidos.push(planEntrenamiento);
      }
    });
    return this.obtenerPlanesAleatorios(planesEntrenamientoValidos);
  }

  async obtenerPlanesRegistradosDeportista(
    deportistaId: number,
  ): Promise<PlanEntrenamientoEntity[]> {
    const deportista: DeportistaEntity =
      await this.deportistaRepository.findOne({
        where: { id: deportistaId },
        relations: ['planesEntrenamiento'],
      });
    if (!deportista)
      throw new BusinessLogicException(
        `El deportista con el id suministrado no ha registrado planes de entrenamiento`,
        BusinessError.NOT_FOUND,
      );

    return deportista.planesEntrenamiento;
  }

  async crear(planEntrenamiento: PlanEntrenamientoEntity) {
    return await this.planEntrenamientoRepository.save(planEntrenamiento);
  }

  async adicionarPlanEntrenamientoDeportista(
    planEntrenamientoId: string,
    deportistaId: number,
  ): Promise<PlanEntrenamientoEntity> {
    let deportista: DeportistaEntity = await this.deportistaRepository.findOne({
      where: { id: deportistaId },
    });
    if (!deportista) {
      deportista = await this.deportistaRepository.save({
        id: deportistaId,
      });
    }

    const planEntrenamiento: PlanEntrenamientoEntity =
      await this.planEntrenamientoRepository.findOne({
        where: { id: planEntrenamientoId },
        relations: ['deportistas'],
      });
    if (!planEntrenamiento)
      throw new BusinessLogicException(
        'No se encontró un plan de entrenamiento con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const deportistaPlanEntrenamiento: DeportistaEntity =
      planEntrenamiento.deportistas.find((e) => e.id === deportista.id);

    if (deportistaPlanEntrenamiento)
      throw new BusinessLogicException(
        `El deportista con el id suministrado ya tiene registrado el plan de entremaniento '${planEntrenamiento.nombre}'`,
        BusinessError.PRECONDITION_FAILED,
      );

    planEntrenamiento.deportistas = [
      ...planEntrenamiento.deportistas,
      deportista,
    ];
    return await this.planEntrenamientoRepository.save(planEntrenamiento);
  }

  async obtenerPlanEntrenamiento(id: string): Promise<PlanEntrenamientoEntity> {
    const planEntrenamiento: PlanEntrenamientoEntity =
      await this.planEntrenamientoRepository.findOne({
        where: { id },
        relations: ['rutinas'],
      });
    if (!planEntrenamiento)
      throw new BusinessLogicException(
        'No se encontró un plan de entrenamiento con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    return planEntrenamiento;
  }

  async actualizar(
    id: string,
    planEntrenamiento: PlanEntrenamientoEntity,
  ): Promise<PlanEntrenamientoEntity> {
    const persistedPlanEntrenamiento: PlanEntrenamientoEntity =
      await this.planEntrenamientoRepository.findOne({
        where: { id: id },
        relations: ['rutinas'],
      });
    if (!persistedPlanEntrenamiento) {
      throw new BusinessLogicException(
        'No se encontró un plan de entrenamiento con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    await this.eliminarRutinas(persistedPlanEntrenamiento);
    return await this.planEntrenamientoRepository.save({
      ...persistedPlanEntrenamiento,
      ...planEntrenamiento,
    });
  }

  async eliminar(id: string) {
    const planEntrenamiento: PlanEntrenamientoEntity =
      await this.planEntrenamientoRepository.findOne({
        where: { id: id },
      });
    if (!planEntrenamiento) {
      throw new BusinessLogicException(
        'No se encontró un plan de entrenamiento con el id suministrado',
        BusinessError.NOT_FOUND,
      );
    }
    await this.planEntrenamientoRepository.delete(planEntrenamiento);
  }

  async eliminarPlanEntrenamientoDeportista(
    planEntrenamientoId: string,
    deportistaId: number,
  ) {
    const deportista: DeportistaEntity =
      await this.deportistaRepository.findOne({
        where: { id: deportistaId },
      });
    if (!deportista)
      throw new BusinessLogicException(
        'No se encontró un deportista con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const planEntrenamiento: PlanEntrenamientoEntity =
      await this.planEntrenamientoRepository.findOne({
        where: { id: planEntrenamientoId },
        relations: ['deportistas'],
      });
    if (!planEntrenamiento)
      throw new BusinessLogicException(
        'No se encontró un plan de entrenamiento con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const deportistaPlanEntrenamiento: DeportistaEntity =
      planEntrenamiento.deportistas.find((e) => e.id == deportistaId);

    if (!deportistaPlanEntrenamiento)
      throw new BusinessLogicException(
        `El deportista con el id suministrado no ha registrado el plan de entremaniento '${planEntrenamiento.nombre}'`,
        BusinessError.PRECONDITION_FAILED,
      );

    planEntrenamiento.deportistas = planEntrenamiento.deportistas.filter(
      (e) => e.id != deportistaId,
    );
    await this.planEntrenamientoRepository.save(planEntrenamiento);
  }

  private obtenerPlanesAleatorios(arr) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * arr.length));
  }

  private async eliminarRutinas(planEntrenamiento: PlanEntrenamientoEntity) {
    planEntrenamiento.rutinas.forEach(async (rutina) => {
      await this.rutinaRepository.delete(rutina);
    });
  }
}
