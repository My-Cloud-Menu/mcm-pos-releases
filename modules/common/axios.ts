import Axios from "axios";
// import { ToastAndroid } from "react-native";

const axios = Axios.create({
  baseURL: `https://frontapi.mycloudmenu.com/front`,
  headers: {
    mcm_api_key:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjpbIkFMTF9BQ0NFU1MiXSwiaWF0IjoxNjc0ODI5MDIzfQ.x1b5y2-Jy6jJSgVY0fce5aVWMHa2PbSpvpHrUSerpEU",
  },
});

axios.interceptors.response.use(
  (response) => response.data,
  (err) => {
    // * Comente esto porque ToastAndroid no esta disponible en Expo Web
    //  ToastAndroid.show('Something went wrong!', 1000);
    console.error(err);
  }
);
export default axios;
