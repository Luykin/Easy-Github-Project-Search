import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
  timeout: 10 * 1000,
});

const sourceRequest: Record<string, any> = {};

instance.interceptors.request.use(
  (request) => {
    const url = String(request.url) + JSON.stringify(request.params);
    if (sourceRequest[url]) {
      sourceRequest[url].cancel();
    }
    const tokenSource = axios.CancelToken.source();
    sourceRequest[url] = { cancel: tokenSource.cancel };
    request.cancelToken = tokenSource.token;
    return request;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
    } else {
      return Promise.reject(error);
    }
  }
);

Object.defineProperty(window, "_CHANGE_API_URL", {
  value: (url: string) => {
    instance.defaults.baseURL = url;
    return true;
  },
});

export default instance;
