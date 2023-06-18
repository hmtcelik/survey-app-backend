import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
 
@Entity('Survey')
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  title: string;
 
  @Column({ nullable: true })
  description: string;
}


