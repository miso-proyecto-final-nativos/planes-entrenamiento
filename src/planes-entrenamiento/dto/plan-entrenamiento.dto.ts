import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RoutineDto } from './routine.dto';

export class PlanEntrenamientoDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly duration: string;

  @IsString()
  readonly image: string;

  @IsNumber()
  readonly suscripcion: number;

  @IsNumber()
  readonly nivelPlan?: number;

  @IsArray()
  readonly routines?: RoutineDto[];
}
