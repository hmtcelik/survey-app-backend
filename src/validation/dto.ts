import { IsNotEmpty, IsString, IsOptional} from 'class-validator';

export class CreateSurveyDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @IsOptional()
  description: string
}
