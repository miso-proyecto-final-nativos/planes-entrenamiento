import { Module } from '@nestjs/common';
import { PlanesEntrenamientoService } from './planes-entrenamiento.service';
import { PlanesEntrenamientoController } from './planes-entrenamiento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntrenamientoEntity } from './entities/plan-entrenamiento.entity';
import { RutinaEntity } from './entities/rutina.entity';
import { DeportistaEntity } from './entities/deportista.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from 'src/config/configuration';
import { TerminusModule } from '@nestjs/terminus';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([
      PlanEntrenamientoEntity,
      RutinaEntity,
      DeportistaEntity,
    ]),
    TerminusModule,
  ],
  controllers: [PlanesEntrenamientoController],
  providers: [
    PlanesEntrenamientoService,
    {
      provide: 'MS_CATALOGO_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('catalogo_microservice.host'),
            port: configService.get<number>('catalogo_microservice.port'),
          },
        }),
    },
    {
      provide: 'AUTH_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('auth_microservice.host'),
            port: configService.get<number>('auth_microservice.port'),
          },
        }),
    },
    {
      provide: 'USER_MS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('usuario_microservice.host'),
            port: configService.get<number>('usuario_microservice.port'),
          },
        }),
    },
  ],
})
export class PlanesEntrenamientoModule {}
