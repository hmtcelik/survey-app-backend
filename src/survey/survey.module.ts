import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey, TextQuestion } from './survey.entity';
import { QuestionController, SurveyController } from './survey.controller';
import { SurveyService, TextQuestionService } from './survey.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, TextQuestion])],
  controllers: [SurveyController, QuestionController],
  providers: [SurveyService, TextQuestionService],
})
export class SurveyModule {}
