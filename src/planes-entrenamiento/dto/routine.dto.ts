import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RoutineDto {
  @IsNumber()
  @IsNotEmpty()
  day: number;

  @IsString()
  @IsNotEmpty()
  exercise: string;
}
