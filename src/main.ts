import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module';

// load env vars in .env file
config(); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  const port = 5000
  
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port)
  .then(()=>{console.log(`started on ${port}`)})
  .catch((e)=>{console.log(e)});
}
bootstrap();
