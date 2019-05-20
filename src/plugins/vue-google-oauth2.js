import Vue from 'vue';
import VueGAPI from "vue-gapi";

// create the 'options' object
const apiConfig = {
  apiKey: "AIzaSyDLwWZYnkSMf-sSI6kd93f0SS-vjyTb4WY",
  clientId: "765980457971-fc59p1cirdsq77tkb8hkemgia9ag8df6.apps.googleusercontent.com",
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  scope: "https://www.googleapis.com/auth/drive"
  // see all available scopes here: https://developers.google.com/identity/protocols/googlescopes'
};

// Use the plugin and pass along the configuration
Vue.use(VueGAPI, apiConfig);