import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import "reflect-metadata"

@Entity()
export class Url {
  constructor(originalUrl: string, shortUrl: string, clickCount: number = 0 ,fullShortUrl:string) {
    this.originalUrl = originalUrl;
    this.shortUrl = shortUrl;
    this.clickCount = clickCount;
   
  }
  
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  originalUrl: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  shortUrl: string;

  @Column({
    type: 'int',
    default: 0,
  })
  clickCount: number;

}
