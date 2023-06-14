import NextAuth, { NextAuthOptions } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
    // https://next-auth.js.org/configuration/providers/oauth
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!.toString(),
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!.toString(),
            issuer: process.env.KEYCLOAK_ISSUER!.toString()!,
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