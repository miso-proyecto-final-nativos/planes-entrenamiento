import { IsArray, IsNotEmpty, IsString } from 'class-validator';
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

  @IsString()
  readonly subscription: string;

  @IsArray()
  readonly routines?: RoutineDto[];
}
