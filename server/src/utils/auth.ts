import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';


export const authenticateToken = async ({ req }: any) => {
    let token = req.body.token || req.query.token || req.headers.authorization;
    let user = null;
  
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
  
    if (!token) {
      return { user: null };
    }
  
    try {
        if (!process.env.JWT_SECRET_KEY) {
            console.error(" JWT_SECRET_KEY is missing from environment variables.");
          }
      const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
      user = data;
    } catch (err) {
      console.log('Invalid token');
    }
  
    return { user };
};

export const signToken = (username: string, _id: unknown) => {
    const payload = { username, _id };
    const secretKey: any = process.env.JWT_SECRET_KEY;

    return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
    constructor(message: string) {
        super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
};