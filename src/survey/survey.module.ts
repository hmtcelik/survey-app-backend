import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultipleChoiceQuestion, Survey, TextQuestion, QuestionChoice } from './survey.entity';
import { QuestionController, SurveyController } from './survey.controller';
import { SurveyService, QuestionService } from './survey.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, TextQuestion, MultipleChoiceQuestion, QuestionChoice])],
  controllers: [SurveyController, QuestionController],
  providers: [SurveyService, QuestionService],
})
export class SurveyModule {}
