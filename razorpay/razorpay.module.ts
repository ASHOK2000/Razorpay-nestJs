import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {  RazorpaySchema } from 'src/dataObjects/schema/razorpay.schema';
import { UserModule } from 'src/user/user.module';
import { RazorpayService } from './razorpay.service';
import { RazorpayController } from './razorpay.controller';
import { razorpayorder } from '../dataObjects/schema/razorpay.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: razorpayorder.name,
        schema: RazorpaySchema,
      },
    ]),
  ],
  controllers: [RazorpayController],
  providers: [RazorpayService],
  exports: [RazorpayService],
})
export class RazorpayModule {}
