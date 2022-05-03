import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../Components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({
  product
}: HomeProps) {

  return (
    <div>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            New about the
            <span>React</span>
            world
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1KvMEvD3Try4VPfGgV5sfL32');  

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'usd'
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product
    }
  }
}