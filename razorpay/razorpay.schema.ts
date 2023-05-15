import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUserProvider } from 'interface/Enum/IUserProvider';
import { IRazorpay } from 'interface/Model/IRazorpay';
import { GenericSchema } from './generic.schema';



type orderObject = {
  amount: number,
  currency: string,
  receipt: string
};

@Schema()
export class razorpayorder extends GenericSchema implements IRazorpay {
  @Prop()
  amount: number;

  @Prop()
  currency: string;

  @Prop()
  receipt: string;

  @Prop()
  created_at: number;


  @Prop({ type: Object })
  order: orderObject;
}

export const RazorpaySchema = SchemaFactory.createForClass(razorpayorder);
