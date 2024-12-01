import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { prisma } from '@/lib/prisma';

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.isEmployee = user.isEmployee;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.isAdmin = token.isAdmin;
      session.user.isEmployee = token.isEmployee;
      return session;
    },
    async redirect({ baseUrl }) {
      console.log('Esta es la url base', baseUrl);
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email', placeholder: 'Email' },
        password: {
          label: 'password',
          type: 'password',
          placeholder: 'Contraseña',
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Credenciales incorrectas');
        }

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error('Email incorrecto');
        }

        const passwordMatch = await compare(
          credentials.password,
          user.password,
        );

        if (!passwordMatch) {
          throw new Error('Contraseña incorrecta');
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isEmployee: user.isEmployee,
        };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
