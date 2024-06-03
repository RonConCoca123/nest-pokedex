import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  //Agregamos un prefijo
  app.setGlobalPrefix('api/v2');
  
  //Configuración global de los Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  //Esperamos al llamado de las peticiones para mostrar
  await app.listen(3000);
}
bootstrap();
