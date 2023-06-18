import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { CreateSurveyDto } from '../validation/dto';
import { Repository } from 'typeorm';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
      private surveyRepository: Repository<CreateSurveyDto>,
  ) {}

  create(survey: CreateSurveyDto): Promise<CreateSurveyDto> {
    return this.surveyRepository.save(
      this.surveyRepository.create(survey)
    );
  }

  findAll(): Promise<CreateSurveyDto[]> {
    return this.surveyRepository.find();
  }

  update(id: string, data: CreateSurveyDto): Promise<any> {
    return this.surveyRepository
      .createQueryBuilder()
      .update()
      .set({
        title: data.title,
        description: data.description,
      })
      .where('id = :id', { id })
      .execute();
  }

  updateOneOrMore(id: string, data: any): Promise<any> {
    const dataKeys = Object.keys(data)
    const changeSet = {}

    if (dataKeys.includes('title')){
      changeSet['title'] = data.title
    }
    if (dataKeys.includes('description')){
      changeSet['description'] = data.description
    }

    return this.surveyRepository
      .createQueryBuilder()
      .update()
      .set(changeSet)
      .where('id = :id', { id })
      .execute();
  }

  delete(id: string): Promise<any> {
    return this.surveyRepository
      .createQueryBuilder()
      .delete()
      .from(Survey)
      .where('id = :id', { id })
      .execute();
  }
}
