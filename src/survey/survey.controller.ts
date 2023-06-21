import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { SurveyService, QuestionService } from './survey.service';
import { CreateSurveyDto, CreateTextQuestionDto, MultipleChoiceQuestionDto } from '../validation/dto';
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
      return this.surveyService.transformSurvey(survey)
  }

  @Post()
  async create(@Body() createSurveyDto: CreateSurveyDto) {
        const survey = await this.surveyService.create(createSurveyDto);
      if(!survey) {
        throw new BadRequestException("error in creating survey")
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
  constructor(private questionService: QuestionService) {}
  
  @Get('text/:id')
  async getTextQuestion(@Param('surveyId') surveyId:number) {
      return await this.questionService.findTextQuestion(surveyId)
  }

  @Get('multiple-choice/:id')
  async getMultipleChoiceQuestion(@Param('surveyId') surveyId:number) {
      return await this.questionService.findTextQuestion(surveyId)
  }

  @Post('text')
  async createTextQuestion(@Body() createTextQuestionDto: CreateTextQuestionDto) {
      const textQuestion = await this.questionService.createText(createTextQuestionDto);
      if(!textQuestion) {
        throw new BadRequestException("error in creating textQuestion")
      }
        return "textQuestion created successfully"
  }

  @Post('multiple-choice')
  async createMultipleChoiceQuestion(@Req() res: Response, @Body() multipleChoiceQuestionDto: MultipleChoiceQuestionDto) {
      const multipleChoiceQuestion = await this.questionService.createMultpleChoice(multipleChoiceQuestionDto);
      console.log(multipleChoiceQuestion);
        
      if(!multipleChoiceQuestion) {
        throw new BadRequestException("error in creating multipleChoiceQuestion")
      }
        return "multipleChoiceQuestion created successfully"
  }
}
