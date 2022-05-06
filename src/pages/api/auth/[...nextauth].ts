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
    async signIn({ user, account, profile, credentials }) {
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