import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericService } from 'src/adhoc/generic.service';
import { RazorpayDto } from 'src/dataObjects/dto/razorpay.dto';
import { razorpayorder } from 'src/dataObjects/schema/razorpay.schema';

@Injectable()
export class RazorpayService extends GenericService<RazorpayDto, razorpayorder> {
  
  constructor(@InjectModel(razorpayorder.name) RazorpayModel: Model<razorpayorder>) {
    super(RazorpayModel);
  
  }
 

}
