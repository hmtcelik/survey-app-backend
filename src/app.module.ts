import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SurveyModule } from './survey/survey.module';
import { AppController } from './app.controller';
import { devConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(devConfig),
    SurveyModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
