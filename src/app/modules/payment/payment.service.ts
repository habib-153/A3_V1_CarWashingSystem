/* eslint-disable @typescript-eslint/no-unused-vars */
import { join } from 'path';
import { verifyPayment } from '../../utils/payment';
import { ServiceBooking } from '../booking/booking.model';
import { readFileSync } from 'fs';

const confirmationService = async (transactionId: string, status: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  let result;
  let message = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    result = await ServiceBooking.updateOne(
      { transactionId },
      {
        paymentStatus: 'Paid',
      },
      {
        new: true,
      },
    );
    message = 'Successfully Paid!';
  } else {
    message = 'Payment Failed!';
  }

  const filePath = join(__dirname, '../../views/confirmation.html');
  let template = readFileSync(filePath, 'utf-8');

  template = template.replace('{{message}}', message);

  return template;
};

export const paymentServices = {
  confirmationService,
};
