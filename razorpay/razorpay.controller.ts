import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { IController } from 'src/adhoc/IController';
import { ExpressJWTRequest } from 'src/auth/IExpressJWTRequest';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginatedDto } from 'src/dataObjects/dto/paginated.dto';
import { PaginationParams } from 'src/dataObjects/dto/pagination-params.dto';
import { RazorpayDto } from 'src/dataObjects/dto/razorpay.dto';
import { RazorpayService } from './razorpay.service';
import { Razorpay } from 'razorpay-typescript';
import * as crypto from 'crypto';
import { IRazorpay } from 'interface/Model/IRazorpay';
import { CommonService } from '../commonServices/common.service';
import { IOrderStatus } from 'interface/Enum/IOrderStatus';

@ApiTags('api/razorpay')
@Controller('api/razorpay')
@ApiExtraModels(PaginatedDto)
@UseGuards(JwtAuthGuard)
export class RazorpayController implements IController<RazorpayDto> {
  constructor(private _razorpayService: RazorpayService,
    // private _commonservice:CommonService
    ) {}
  findAll(req: ExpressJWTRequest, searchQurey: Object, { skip, limit }: PaginationParams, qureyVariable: any): Promise<PaginatedDto<any>> {
    throw new Error('Method not implemented.');
  }
  update(
    req: ExpressJWTRequest,
    query: Object,
    updateDto: RazorpayDto,
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(req: ExpressJWTRequest, query: Object): Promise<any> {
    throw new Error('Method not implemented.');
  }

  // create an order id
  @Post('order')
  async create(
    @Req() req: ExpressJWTRequest,
    @Body() razor: RazorpayDto,
  ): Promise<RazorpayDto> {

    
    const instance = new Razorpay({
      authKey: {
        key_id: 'rzp_test_7mJHXXQKhpPdob',
        key_secret: 'E7hyCR1nrZsUp6mblJogy0n1',
      },
    });
    const order = await instance.orders.create({ 
      amount: razor.amount,
      currency: razor.currency,
      receipt: razor.receipt,
    });

    const payment = {
      created_user: req.user.tokenDetails.uuid,
      created_date: new Date(),
      order:order,
    }


    return (this._razorpayService.create(payment) as unknown) as Promise<RazorpayDto>
  }

  // get order by uuid 

@Get(':uuid')
@UseGuards(JwtAuthGuard)
findOne(
  @Req() req: ExpressJWTRequest,
  @Param('uuid') uuid: string,
): Promise<any> {
  const query: FilterQuery<IRazorpay> = {
    $and: [{ uuid: uuid, isDeleted: false }],
  };
  return this._razorpayService.findOne(query);
}


// create a new order check existing order 

// @Post("razor/order")
// async addNewRazorPayOrder(
//   @Req() req:ExpressJWTRequest,
//   @Body() body: RazorpayDto,
//   @Res() res: Response,

// ):Promise<any>{

//   const uuid = req.user.tokenDetails
//   if (uuid == undefined || null) return this._commonservice.insufficientParameters(res);

//   const orderExist: any = await this._razorpayService.findOne({
//     $and: [
//       { uuid: req.body.orderId, isDeleted: false, status: IOrderStatus.Pending },
//     ],
//   })

//   if (!orderExist)
//     return this._commonservice.successResponse("Order Not Found", orderExist, res);
//   if (orderExist?.address == undefined)
//     return this._commonservice.successResponse("Address Not Found", orderExist, res);
//   const instance = new Razorpay({
//     key_id: process.env.RAZOR_PAY_KEY_ID,
//     key_secret: process.env.RAZOR_PAY_KEY_SECRET,
//   });
//   const params = {
//     amount: req.body.totalAmount
//   };
//   instance.orders.create(params, (err, result) => {
//     if (err) {
//       return this._commonservice.mongoError(err, res);
//     }
//     const razorpay_params: _IRazorpay = {
//       uuid: uuid.v4(),
//       userId: req.user.uuid,
//       orderId: req.body.orderId,
//       amount: req.body.totalAmount,
//       razorpayId: result.id,
//       currency: result.currency,
//       receipt: result.receipt,
//       razorpayStatus: result.status,
//       email: req.user.email,
//       phoneNo: null,
//       razorpayDate: result.created_at,
//       entity: result.entity,
//       created_user: req.user.uuid
//     };
//     this.razorpay_service.create(
//       razorpay_params,
//       async (err: MongoError, razorpay_data: _IRazorpay) => {
//         if (err) {
//           return this._commonservice.mongoError(err, res);
//         } else {
//           const orderFilter: FilterQuery<IOrder> = {
//             uuid: razorpay_data.orderId,
//           };
//           const orderUniqueId: string = await this.addUniqueOrderId(this._commonservice.returnUniqueId());
//           const value: UpdateQuery<IOrder> = {
//             orderId: orderUniqueId,
//             retryId: result.id
//           };
//           await this.order_controller.paymentGenerateOrderId(
//             orderFilter,
//             value,
//             res,
//             razorpay_data
//           );
//         }
//       }
//     );
//   });

// }




  @Post('pay-verify')
  async orderverify(
    @Req() req: ExpressJWTRequest,
    @Body() body: RazorpayDto,
  ): Promise<any> {
    body = req.body.razorpay_order_id , req.body.razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', 'E7hyCR1nrZsUp6mblJogy0n1')
      .update(body.toString())
      .digest('hex');

    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);

    if (expectedSignature === req.body.razorpay_signature) {
      console.log("payment Successful");
    } else {
      console.log("payment Fail");
    }
  }


}

// @Put(':uuid')
// @UseGuards(JwtAuthGuard)
// update(
//   @Req() req: ExpressJWTRequest,
//   @Param('uuid') uuid: string,
//   @Body() updateDto: Partial<RazorpayDto>,
// ): Promise<razorpayorder> {
//   const query: FilterQuery<IRazorpay> = {
//     $and: [{ uuid: uuid, isDeleted: false }],
//   };
//   updateDto.modified_user = req.user.tokenDetails.uuid;
//   return this._razorpayService.update(query, updateDto);
// }

// @Delete(':uuid')
// @UseGuards(JwtAuthGuard)
// delete(
//   @Req() req: ExpressJWTRequest,
//   @Param('uuid') uuid: string,
// ): Promise<razorpayorder> {
//   const query: FilterQuery<IRazorpay> = {
//     $and: [{ uuid: uuid, isDeleted: false }],
//   };
//   return this._razorpayService.delete(query, req.user.tokenDetails.uuid);
// }


// amount: 5000 * 100, // amount is in paisa
// currency: 'INR',
// receipt: 'receipt#1',