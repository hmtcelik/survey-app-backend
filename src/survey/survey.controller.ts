import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { SurveyService, TextQuestionService } from './survey.service';
import { CreateSurveyDto, CreateTextQuestionDto } from '../validation/dto';
import { BaseInterceptor } from '../app.interceptor';
import { Survey, TextQuestion } from './survey.entity';

@UseInterceptors(BaseInterceptor)
@Controller()
export class SurveyController {
  constructor(private surveyService: SurveyService) {}
  
  @Get()
  async findAll(@Req() request: Request) {
      const surveys: Survey[] = await this.surveyService.findAll()
      return surveys
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() request: Request) {
      const survey: Survey = await this.surveyService.findOne(id)
      return survey
  }

  @Post()
  async create(@Body() createSurveyDto: CreateSurveyDto) {
        const survey = await this.surveyService.create(createSurveyDto);
      if(!survey) {
        return "error in creating survey"
      }
        return "survey created successfully"
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: CreateSurveyDto) {
      console.log(body);
      
      const survey: any = await this.surveyService.update(id, body)
      return "survey updated";
  }

  @Patch(':id')
  async updateOneOrMore(@Param('id') id: string, @Body() body: any) {
      const survey: any = await this.surveyService.updateOneOrMore(id, body)
      return "survey updated";
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
      await this.surveyService.delete(id)
      return "survey deleted"
  }

}

@UseInterceptors(BaseInterceptor)
@Controller('question')
export class QuestionController {
  constructor(private textQuestionService: TextQuestionService) {}
  
  @Get(':surveyId')
  async getAllBySurveyId(@Param('surveyId') surveyId:number, @Req() request: Request) {
      const textQuestions: TextQuestion[] = await this.textQuestionService.findAllBySurvey(surveyId)
      return textQuestions
  }

  @Post('text')
  async createTextQuestion(@Body() createTextQuestionDto: CreateTextQuestionDto) {
        const textQuestion = await this.textQuestionService.create(createTextQuestionDto);
      if(!textQuestion) {
        return "error in creating textQuestion"
      }
        return "textQuestion created successfully"
  }

}