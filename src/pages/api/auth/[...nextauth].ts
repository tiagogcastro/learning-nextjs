import { query } from 'faunadb';

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { faunadb } from '../../../services/faunadb';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        }
      }
    }),
  ],
  secret: process.env.SIGNING_KEY,
  callbacks: {
    async session({session}) {  
      try {
        const userActiveSubscription = await faunadb.query(
          query.Get(
            query.Intersection([
              query.Match(
                query.Index('subscription_by_user_ref'),
                query.Select(
                  'ref',
                  query.Get(
                    query.Match(
                      query.Index('user_by_email'),
                      query.Casefold(session.user.email)
                    )
                  )
                )
              ),
              query.Match(
                query.Index('subscription_by_status'),
                'active'
              )
            ])
          ) 
        );

        return {
          ...session,
          activeSubscription: userActiveSubscription
        };
      } catch (error) {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
    async signIn({ user }) {
      const { email } = user;

      try {
        const match_by_email_faunadb = query.Match(
          query.Index('user_by_email'),
          query.Casefold(email)
        );

        await faunadb.query(
          query.If(
            query.Not(
              query.Exists(
                match_by_email_faunadb
              )
            ),
            query.Create(
              query.Collection('users'),
              {data: {
                email
              }}
            ),
            query.Get(
              match_by_email_faunadb
            )
          )
        );

        return true;
      } catch (error) {
        return false;
      }
    },
  }
})