import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanesEntrenamientoService } from './planes-entrenamiento.service';
import { CreatePlanesEntrenamientoDto } from './dto/create-planes-entrenamiento.dto';
import { UpdatePlanesEntrenamientoDto } from './dto/update-planes-entrenamiento.dto';

@Controller('planes-entrenamiento')
export class PlanesEntrenamientoController {
  constructor(
    private readonly planesEntrenamientoService: PlanesEntrenamientoService,
  ) {}

  @Post()
  create(@Body() createPlanesEntrenamientoDto: CreatePlanesEntrenamientoDto) {
    return this.planesEntrenamientoService.create(createPlanesEntrenamientoDto);
  }

  @Get()
  findAll() {
    return this.planesEntrenamientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planesEntrenamientoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlanesEntrenamientoDto: UpdatePlanesEntrenamientoDto,
  ) {
    return this.planesEntrenamientoService.update(
      +id,
      updatePlanesEntrenamientoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planesEntrenamientoService.remove(+id);
  }
}
