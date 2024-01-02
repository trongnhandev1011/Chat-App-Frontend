import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const GENERAL_BASE_URL = import.meta.env.VITE_GENERAL_ENDPOINT;

const axiosClient = axios.create({
  baseURL: GENERAL_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosAuthClient = axios.create({
  baseURL: GENERAL_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

const refresh = () => {
  if (isRefreshing) return Promise.reject();
  isRefreshing = true;
  return axiosClient.post("/auth/refresh").then(() => {
    isRefreshing = false;
  });
};

axiosClient.interceptors.response.use(undefined, (error) => {
  const originalRequest = error.config;
  const status = error?.response?.status;

  // For invalid password or expired/invalid refresh_token
  console.log(originalRequest.url);
  if (
    status === 401 &&
    ["/auth/login", "/auth/refresh"].includes(originalRequest.url)
  ) {
    return Promise.reject(error);
  }

  // For expired tokens
  if (status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    return refresh().then(() => {
      return axiosClient(originalRequest);
    });
  }

  return Promise.reject(error);
});

//set client base URL again
axiosClient.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    // Do something before request is sent

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    return Promise.reject(error);
  }
);

export const fetcher = <T = unknown, R = AxiosResponse<T>>(
  url: string
): Promise<R> => axiosClient.get<R>(url).then((res) => res.data);

export default axiosClient;
