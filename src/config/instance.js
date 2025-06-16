import axios from 'axios';

const baseURL = "http://localhost:8888/.netlify/functions/api";
// const baseURL = "https://sds-server.netlify.app/.netlify/functions/api";

const instance = axios.create({
    baseURL
});

export { baseURL };

export default instance;