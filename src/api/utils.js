import Vue from 'vue'

// eslint-disable-next-line max-len
export const drive = () => new Promise(resolve => new Vue().$getGapiClient().then(gapi => resolve(gapi.client.drive)))

export default {
  drive
}
