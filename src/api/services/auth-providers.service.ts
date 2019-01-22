/* eslint-disable camelcase */
import { default as Axios } from "axios";

const facebook = async (access_token) => {
  const fields = 'id, name, email, picture';
  const url = 'https://graph.facebook.com/me';
  const params = { access_token, fields };
  const response = await Axios.get(url, { params });
  const {
    id, name, email, picture,
  } = response.data;
  return {
    service: 'facebook',
    picture: picture.data.url,
    id,
    name,
    email,
  };
};

const google = async (access_token) => {
  const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  const params = { access_token };
  const response = await Axios.get(url, { params });
  const {
    sub, name, email, picture,
  } = response.data;
  return {
    service: 'google',
    picture,
    id: sub,
    name,
    email,
  };
};

export { facebook, google };