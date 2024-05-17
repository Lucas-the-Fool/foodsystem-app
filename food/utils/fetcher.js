import request from "./request";

const fetcher = (url) => request.get(url).then(res => res.data);

export default fetcher;