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
      relations: ['textQuestions', 'multipleQuestions', 'multipleQuestions.choices'],
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

  transformSurvey(survey: Survey): any {
    const transformedQuestions = [];
  
    // Transform text questions
    transformedQuestions.push(
      ...survey.textQuestions.map((question) => ({
        id: question.id,
        question_type: 'text',
        index: question.index,
        question: question.question,
      }))
    );
  
    // Transform multiple choice questions
    survey.multipleQuestions.forEach((question) => {
      transformedQuestions.push({
        id: question.id,
        question_type: 'multiple-choice',
        index: question.index,
        question: question.question,
        choices: question.choices.map((choice) => ({
          id: choice.id,
          choice: choice.choice,
        })),
      });
    });
  
    // Sort the transformed questions array by index
    transformedQuestions.sort((a, b) => a.index - b.index);
  
    return {
      success: true,
      message: '',
      data: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        questions: transformedQuestions,
      },
    };
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

  async createMultpleChoice(question: MultipleChoiceQuestionDto): Promise<MultipleChoiceQuestion> {
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

    const multipleChoice = this.multipleChoiceRepository.create({
      index: question.index,
      question: question.question,
      survey: survey,
      choices: []
    });

    const savedQuestion = await this.multipleChoiceRepository.save(multipleChoice);

    for (const questionChoice of question.choices) {
      console.log(questionChoice);
      
      const newChoice = this.questionChoiceRepository.create({
        choice: questionChoice,
        question: savedQuestion
      });
      await this.questionChoiceRepository.save(newChoice);
    }

    return savedQuestion
  }

  async findTextQuestion(id:number): Promise<TextQuestion> {
    return await this.multipleChoiceRepository.findOne({where: {id:id}});
  }

  async findMultipleChoiceQuestion(id:number): Promise<MultipleChoiceQuestion> {
    return await this.multipleChoiceRepository.findOne({where: {id:id}});
  }
}

