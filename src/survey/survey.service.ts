import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MultipleChoiceQuestion, QuestionChoice, Survey, TextQuestion } from './survey.entity';
import { CreateSurveyDto, CreateTextQuestionDto, MultipleChoiceQuestionDto } from '../validation/dto';
import { Repository } from 'typeorm';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
      private surveyRepository: Repository<Survey>,
  ) {}

  create(survey: CreateSurveyDto): Promise<CreateSurveyDto> {
    return this.surveyRepository.save(
      this.surveyRepository.create(survey)
    );
  }

  findAll(): Promise<Survey[]> {
    return this.surveyRepository.find();  
  }

  findOne(id: number): Promise<Survey> {
    return this.surveyRepository.findOne({
      where: {id: id},
      relations: ['textQuestions', 'multipleQuestions'],
    });  
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


@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(MultipleChoiceQuestion)
    private multipleChoiceRepository: Repository<MultipleChoiceQuestion>,

    @InjectRepository(QuestionChoice)
    private questionChoiceRepository: Repository<QuestionChoice>,

    @InjectRepository(TextQuestion)
    private textQuestionRepository: Repository<TextQuestion>,

    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}

  async createText(question: CreateTextQuestionDto): Promise<TextQuestion> {
    const survey = await this.surveyRepository.findOne({where: {id:question.surveyId}});
    if (!survey) {
      throw new NotFoundException(`Survey with ID ${question.surveyId} not found.`);
    }

    // check if index already exist in this survey
    const checkIndexText = await this.textQuestionRepository.findOne({where: {survey:survey, index:question.index}});
    const checkIndexMultipleChoice = await this.multipleChoiceRepository.findOne({where: {survey:survey, index:question.index}});
    if (checkIndexMultipleChoice || checkIndexText) {
      throw new BadRequestException(`The given index already exist.`);
    }

    const textQuestion = this.textQuestionRepository.create({
      index: question.index,
      question: question.question,
      survey: survey,
    });

    return this.textQuestionRepository.save(textQuestion);
  }

  // async createMultpleChoice(question: MultipleChoiceQuestionDto): Promise<MultipleChoiceQuestion> {
  //   const survey = await this.surveyRepository.findOne({where: {id:question.surveyId}});
  //   if (!survey) {
  //     throw new NotFoundException(`Survey with ID ${question.surveyId} not found.`);
  //   }

  //   // check if index already exist in this survey
  //   const checkIndexText = await this.textQuestionRepository.findOne({where: {survey:survey, index:question.index}});
  //   const checkIndexMultipleChoice = await this.multipleChoiceRepository.findOne({where: {survey:survey, index:question.index}});
  //   if (checkIndexMultipleChoice || checkIndexText) {
  //     throw new BadRequestException(`The given index already exist.`);
  //   }

  //   const multipleChoice = this.multipleChoiceRepository.create({
  //     index: question.index,
  //     question: question.question,
  //     survey: survey,
  //     choices: []
  //   });

  //   const savedQuestion = this.multipleChoiceRepository.save(multipleChoice);

  //   var questionChoices: QuestionChoice[] = [] 
  //   for (const questionChoice of question.choices){
  //     const newChoice = this.questionChoiceRepository.create(
  //       {
  //         choice: questionChoice.choice,
  //         question: savedQuestion
  //       }
  //     )
  //     const savedChoice = await this.questionChoiceRepository.save(newChoice);
  //     questionChoices.push(savedChoice);
  //   }

  //   this.multipleChoiceRepository.createQueryBuilder().update().set().where

  //   return ;
  // }

  async findAllBySurvey(surveyId:number): Promise<TextQuestion[]> {
    const survey = await this.surveyRepository.findOne({where: {id:surveyId}});
    if (!survey) {
      throw new NotFoundException(`Survey with ID ${surveyId} not found.`);
    }

    return this.multipleChoiceRepository.find({where: {survey: survey}});  
  }
}
