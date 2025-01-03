import * as bcrypt from 'bcrypt';

export function hash(password: string, saltRounds: number) {
  return bcrypt.hash(password, saltRounds);
}

export function compare(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
