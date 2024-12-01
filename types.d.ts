type Nullable<T> = T | null;

type IUserDecoded = {
  email: string;
  id: string;
  iat: number;
  exp: number;
};

declare namespace Express {
  export interface Request {
    user?: IUserDecoded;
  }
}
