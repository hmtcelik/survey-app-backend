import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
 
@Entity('Survey')
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  title: string;
 
  @Column({ nullable: true })
  description: string;

  @OneToMany(() => TextQuestion, question => question.survey)
  textQuestions: TextQuestion[];

  @OneToMany(() => MultipleChoiceQuestion, question => question.survey)
  multipleQuestions: MultipleChoiceQuestion[];  
}


@Entity('TextQuestion')
export class TextQuestion {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  index: number;

  @Column()
  question: string;

  @ManyToOne(() => Survey, survey => survey.textQuestions)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;
}


@Entity('MultipleChoiceQuestion')
export class MultipleChoiceQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  index: number;

  @Column()
  question: string;

  @OneToMany(() => QuestionChoice, choice => choice.question)
  choices: QuestionChoice[];

  @ManyToOne(() => Survey, survey => survey.multipleQuestions)
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;
}


@Entity('QuestionChoice')
export class QuestionChoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  choice: string;

  @ManyToOne(() => MultipleChoiceQuestion, question => question.choices)
  @JoinColumn({ name: 'questionId' })
  question: MultipleChoiceQuestion;
}
