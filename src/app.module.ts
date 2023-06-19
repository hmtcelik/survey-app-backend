import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SurveyModule } from './survey/survey.module';
import { AppController } from './app.controller';
import { devConfig } from './config/database.config';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(devConfig),
    SurveyModule,
    RouterModule.register([
      {
        path: 'survey',
        module: SurveyModule,
      },
    ])
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
