import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenericDto } from './generic.dto';
import { IRazorpay } from '../../../interface/Model/IRazorpay';


type orderObject = {
  amount: number,
  currency: string,
  receipt: string,
};


export class RazorpayDto extends GenericDto implements IRazorpay {


  @ApiProperty()
  @IsObject()
  @IsOptional()
  order: orderObject;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  amount: number;


  @ApiProperty()
  @IsString()
  @IsOptional()
  currency: string;


  @ApiProperty()
  @IsString()
  @IsOptional()
  receipt: string;


  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;


  @ApiProperty()
  @IsOptional()
  attempts: any;

  
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  created_at: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;


}
