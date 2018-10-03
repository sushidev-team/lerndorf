import * as types from './constants';

export const userRegisterSuccess = user => ({
  type: types.USER_REGISTER_SUCCESS,
  user,
});

export const userRegisterFailed = (error, errors) => ({
  type: types.USER_REGISTER_FAILED,
  error,
  errors,
});

export const userRegister = (data, history) => (
  dispatch => fetch('/api/users', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then((json) => {
      if (json) {
        if (json.error) {
          dispatch(userRegisterFailed(json.error, json.errors));
        } else {
          dispatch(userRegisterSuccess(json));
          history.push('/login');
        }
      }
    })
    .catch((error) => {
      console.log('Error during registration:', error);
    })
);
