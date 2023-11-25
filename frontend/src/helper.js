import Config from './config.json';

const URL_BASE = `http://localhost:${Config.BACKEND_PORT}/`;

const APIcall = async (payload, route, success) => {
  const response = await fetch(`${URL_BASE}${route}`, payload);
  // console.log('Response from API ', response);
  const data = await response.json();
  // console.log(data);
  return data;
};

export default APIcall;
