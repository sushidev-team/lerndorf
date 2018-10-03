import { LOGIN } from './constants';

export * from './user';

export function login(user, password) {
  return {
    type: LOGIN,
    user,
    password,
  };
}

export function logout() {
  return {
    type: LOGIN,
  };
}
