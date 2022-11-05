import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Put,
  HttpCode,
  Inject,
  RequestTimeoutException,
  UseGuards,
} from '@nestjs/common';
import { PlanesEntrenamientoService } from './planes-entrenamiento.service';
import { PlanEntrenamientoDto } from './dto/create-planes-entrenamiento.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PlanEntrenamientoEntity } from './entities/plan-entrenamiento.entity';
import { plainToInstance } from 'class-transformer';
import { ClientProxy } from '@nestjs/microservices';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { AuthGuard } from './guards/auth.guard';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('planes-entrenamiento')
export class PlanesEntrenamientoController {
  constructor(
    @Inject('USER_MS') private clienteUsuarioService: ClientProxy,
    private readonly planesEntrenamientoService: PlanesEntrenamientoService,
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  async healthCheck() {
    return this.health.check([async () => this.db.pingCheck('database')]);
  }

  @UseGuards(AuthGuard)
  @Post()
  async crear(@Body() planEntrenamientoDto: PlanEntrenamientoDto) {
    const planEntrenamiento: PlanEntrenamientoEntity = plainToInstance(
      PlanEntrenamientoEntity,
      planEntrenamientoDto,
    );
    return this.planesEntrenamientoService.crear(planEntrenamiento);
  }

  @UseGuards(AuthGuard)
  @Post(':planEntrenamientoId/deportistas/:deportistaId')
  async adicionarPlanEntrenamientoDeportista(
    @Param('planEntrenamientoId') planEntrenamientoId: string,
    @Param('deportistaId') deportistaId: number,
  ) {
    await this.validarIdDeportista(deportistaId);
    return await this.planesEntrenamientoService.adicionarPlanEntrenamientoDeportista(
      planEntrenamientoId,
      deportistaId,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async obtenerTodos() {
    return this.planesEntrenamientoService.obtenerTodos();
  }

  @UseGuards(AuthGuard)
  @Get('deportista/:deportistaId/sugeridos')
  async obtenerPlanesSugeridosDeportista(
    @Param('deportistaId') deportistaId: number,
  ) {
    await this.validarIdDeportista(deportistaId);
    return this.planesEntrenamientoService.obtenerPlanesSugeridosDeportista(
      deportistaId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('deportista/:deportistaId/registrados')
  async obtenerPlanesRegistradosDeportista(
    @Param('deportistaId') deportistaId: number,
  ) {
    await this.validarIdDeportista(deportistaId);
    return this.planesEntrenamientoService.obtenerPlanesRegistradosDeportista(
      deportistaId,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':planEntrenamientoId')
  async obtenerPlanEntrenamiento(
    @Param('planEntrenamientoId') planEntrenamientoId: string,
  ) {
    return this.planesEntrenamientoService.obtenerPlanEntrenamiento(
      planEntrenamientoId,
    );
  }

  @UseGuards(AuthGuard)
  @Put(':planEntrenamientoId')
  actualizar(
    @Param('planEntrenamientoId') planEntrenamientoId: string,
    @Body() planEntrenamientoDto: PlanEntrenamientoDto,
  ) {
    const planEntrenamiento: PlanEntrenamientoEntity = plainToInstance(
      PlanEntrenamientoEntity,
      planEntrenamientoDto,
    );
    return this.planesEntrenamientoService.actualizar(
      planEntrenamientoId,
      planEntrenamiento,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':planEntrenamientoId')
  remove(@Param('planEntrenamientoId') planEntrenamientoId: string) {
    return this.planesEntrenamientoService.eliminar(planEntrenamientoId);
  }

  @UseGuards(AuthGuard)
  @Delete(':planEntrenamientoId/deportistas/:deportistaId')
  @HttpCode(204)
  async eliminarPlanEntrenamientoDeportista(
    @Param('planEntrenamientoId') planEntrenamientoId: string,
    @Param('deportistaId') deportistaId: number,
  ) {
    await this.validarIdDeportista(deportistaId);
    return this.planesEntrenamientoService.eliminarPlanEntrenamientoDeportista(
      planEntrenamientoId,
      deportistaId,
    );
  }

  private async validarIdDeportista(idDeportista: number) {
    const deportista$ = this.clienteUsuarioService
      .send({ role: 'user', cmd: 'getById' }, { idDeportista })
      .pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(() => err);
        }),
      );

    const deportista = await firstValueFrom(deportista$);

    if (!deportista) {
      throw new BusinessLogicException(
        `No se encontró un deportista con el id ${idDeportista}`,
        BusinessError.NOT_FOUND,
      );
    }
  }
}
