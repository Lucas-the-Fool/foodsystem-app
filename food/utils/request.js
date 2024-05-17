// request.js
import axios from 'axios';

const request = axios.create({
  baseURL: 'http://10.0.2.2:8000/api',  // 调整需要的 URL
});

export default request;