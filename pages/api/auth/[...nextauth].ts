import { ExtendedToken, TokenError } from "@/types";
import NextAuth, { CallbacksOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { scopes, spotifyApi } from "../../../config/spotify";

const refreshAccessToken = async (
  token: ExtendedToken
): Promise<ExtendedToken> => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedTokens } = await spotifyApi.refreshAccessToken();

    console.log("REFRESGED TOKENS ARE: ", refreshedTokens);
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token || token.refreshToken,
      accessTokenExporesAt: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: TokenError.RefreshAccessTokenError,
    };
  }
};

const jwtCallback: CallbacksOptions["jwt"] = async ({
  token,
  account,
  user,
}) => {
  let extendedToken: ExtendedToken;
  if (account && user) {
    extendedToken = {
      ...token,
      user,
      accessToken: account.access_token as string,
      refreshToken: account.refresh_token as string,
      accessTokenExporesAt: (account.expires_at as number) * 1000, //converted to ms
    };

    console.log("First time login, extened token: ", extendedToken);
    return extendedToken;
  }

  if (Date.now() + 5000 < (token as ExtendedToken).accessTokenExporesAt) {
    console.log("ACCESS TOKEN STILL VALID, RETURNING EXTENDED TOKEN:", token);
    return token;
  }
  console.log("ACCESS TOKEN EXPIRED, refresh");
  return await refreshAccessToken(token as ExtendedToken);
};

const sessionCallback: CallbacksOptions["session"] = async ({
  session,
  token,
}) => {
  session.accessToken = (token as ExtendedToken).accessToken;
  session.error = (token as ExtendedToken).error;
  return session;
};

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: scopes,
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
});
