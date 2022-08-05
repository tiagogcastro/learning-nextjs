import { query } from 'faunadb';
import Stripe from 'stripe';
import { faunadb } from '../../../services/faunadb';
import { stripe } from '../../../services/stripe';

type Subscription = {
  ref: {
    id: string;
  };
  data: {
    id: string;
    userId: object;
    status: Stripe.Subscription.Status;
    price_id: string;
  }
}

export async function saveSubscription(
  subscriptionId: string, 
  customerId: string,
  createAction: boolean,
) {
  const userRef = await faunadb.query(
    query.Select(
      'ref',
      query.Get(
        query.Match(
          query.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if(createAction) {
    return faunadb.query(
      query.Create(
        query.Collection('subscriptions'),
        {
          data: subscriptionData
        }
      )
    );
  } else {
    console.log('else');
    try {
      const subscription = await faunadb.query<Subscription>( 
        query.Get(
          query.Match(
            query.Index('subscription_by_id'),
          )
        )
      );

      await faunadb.query(
        query.Replace(
          query.Ref(
            query.Collection('subscriptions'), 
            subscription.ref.id
          ),
          {
            data: subscriptionData
          }
        )
      );
    } catch (e) {
      console.log({e});
    }
  }
}