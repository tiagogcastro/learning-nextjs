import { query } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { faunadb } from '../../services/faunadb';
 
import { prices_id, stripe } from '../../services/stripe';

type User = {
  ref: {
    id: string;
  };

  data: {
    stripe_customer_id: string;
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request: NextApiRequest, response: NextApiResponse) => {
  if(request.method === 'POST') {
    const session = await getSession({
      req: request,
    });
    
    try {
      const user = await faunadb.query<User>(
        query.Get(
          query.Match(
            query.Index('user_by_email'),
            query.Casefold(session.user.email),
          )
        )
      );

      let customerId = user.data.stripe_customer_id;

      if(!customerId) {
        const stripeCustomer = await stripe.customers.create({
          email: session.user.email,
          // metadata,
        });

        await faunadb.query(
          query.Update(
            query.Ref(query.Collection('users'), user.ref.id),
            {
              data: {
                stripe_customer_id: stripeCustomer.id,
              }
            }
          )
        );

        customerId = stripeCustomer.id;
      }

      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        line_items: [
          {
            price: prices_id,
            quantity: 1,
          }
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
      });

      return response.status(200).json({
        sessionId: stripeCheckoutSession.id
      });

    } catch (error) {
      console.log({error});
    }

  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}