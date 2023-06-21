import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray} from 'class-validator';

export class CreateSurveyDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @IsOptional()
  description: string
}


export class CreateTextQuestionDto {
  @IsNotEmpty()
  @IsNumber()
  surveyId: number

  @IsNotEmpty()
  @IsNumber()
  index: number

  @IsNotEmpty()
  @IsString()
  question: string;
}


export class MultipleChoiceQuestionDto {
  @IsNotEmpty()
  @IsNumber()
  surveyId: number

  @IsNotEmpty()
  @IsNumber()
  index: number

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsArray()
  choices: string[];
  // choices: ChoiceDto[];
}


// class ChoiceDto{
//   @IsNotEmpty()
//   @IsString()
//   choice: string
// }
