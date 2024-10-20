import { validate as isValidUUID } from 'uuid';
import { User } from './interfaces';

export const getUser = (userId: string, users: User[]) => {
  if (userId && isValidUUID(userId)) {
    if (users.find((user) => user.id === userId)) {
      return users.find((user) => user.id === userId);
    } else {
      return false;
    }
  } else {
   return "User's id is invalid";
  }
}

