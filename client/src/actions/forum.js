import * as types from './constants';

export const forumItemsFetchSuccess = (items) => ({
  type: types.FORUM_ITEMS_FETCH_SUCCESS,
  items,
});

export const forumItemsFetchFailed = (error, errors) => ({
  type: types.FORUM_ITEMS_FETCH_FAILED,
  error,
  errors,
});

export const forumThreadFetchSuccess = (item) => ({
  type: types.THREAD_ITEM_FETCH_SUCCESS,
  item,
});

export const forumThreadFetchFailed = (error, errors) => ({
  type: types.THREAD_ITEM_FETCH_FAILED,
  error,
  errors,
});

export const forumThreadFetchAddAnswerSuccess = (item) => ({
  type: types.THREAD_ITEM_FETCH_SUCCESS,
  item,
});

export const forumThreadFetchAddAnswerFailed = (error, errors) => ({
  type: types.THREAD_ITEM_FETCH_FAILED,
  error,
  errors,
});

export const forumPublicThreadsFetch = () => async (dispatch) =>
  fetch('/api/threads', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((json) => {
      if (json) {
        if (!json.error) {
          dispatch(forumItemsFetchSuccess(json));
        }
      }
    })
    .catch((error) => {
      console.log('Error while fetching knowledge units:', error);
    });

export const forumThreadFetch = (id) => async (dispatch) =>
  fetch(`/api/threads/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((json) => {
      if (json) {
        if (!json.error) {
          dispatch(forumThreadFetchSuccess(json));
        }
      }
    })
    .catch((error) => {
      console.log('Error while fetching knowledge units:', error);
    });

export const forumThreadFetchAddAnswer = (id, data, history) => (dispatch) =>
  fetch(`/api/threads/${id}/answers`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json) {
        if (json.error) {
          dispatch(forumThreadFetchAddAnswerFailed(json.error, json.errors));
        } else {
          dispatch(forumThreadFetchAddAnswerSuccess());
          history.push(`/threads/${json.id}`);
        }
      }
    })
    .catch((error) => {
      console.log('Error while answering to a forum thread:', error);
    });
