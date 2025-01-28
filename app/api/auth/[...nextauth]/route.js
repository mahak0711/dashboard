import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

const handler =NextAuth ({
  // Configure one or more authentication providers
  providers: [
    
    
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      redirectUri: 'http://localhost:3000/api/auth/callback/github',

    }),
    
    
  ],
})

export {handler as GET,handler as POST}