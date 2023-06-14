import NextAuth, { NextAuthOptions } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    // https://next-auth.js.org/configuration/providers/oauth
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID as string,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
            issuer: process.env.KEYCLOAK_ISSUER as string,
            accessTokenUrl :  process.env.KEYCLOAK_ACCESS_TOKEN_URL as string,
            profileUrl : process.env.KEYCLOAK_PROFILE_URL as string,
        })
    ],
    callbacks: {
        async jwt({ token }) {
            token.userRole = "Admin"
            return token
        },
    },
}

export default NextAuth(authOptions)