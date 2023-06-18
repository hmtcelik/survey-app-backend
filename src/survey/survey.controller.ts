import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from '../validation/dto';
import { BaseInterceptor } from '../app.interceptor';

@UseInterceptors(BaseInterceptor)
@Controller('survey')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  async create(@Body() createSurveyDto: CreateSurveyDto) {
      console.log(createSurveyDto);
      
      const survey = await this.surveyService.create(createSurveyDto);
      if(!survey) {
        return "error in creating survey"
      }
        return "survey created successfully"
  }

  @Get()
  async findAll(@Req() request: Request) {
      const surveys: Array<CreateSurveyDto> = await this.surveyService.findAll()
      return surveys
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
