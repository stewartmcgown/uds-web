/* ============
 * Vuex Store
 * ============
 *
 * The store of the application.
 *
 * http://vuex.vuejs.org/en/index.html
 */

import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

// Modules
import account from './modules/account';
import auth from './modules/auth';
import files from './modules/files';


const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  /**
   * Assign the modules to the store.
   */
  modules: {
    account,
    auth,
    files
  },

  /**
   * If strict mode should be enabled.
   */
  strict: debug,

  /**
   * Plugins used in the store.
   */
  plugins: debug ? [createLogger()] : [],

  state: {
    notification: {
      visible: false,
      text: null,
      timeout: 6000,
      multiline: false,
      indeterminate: false,
      close: true
    },
    notificationQueue: []
  },

  actions: {
    notification({
      commit
    }, payload) {
      //commit('pushNotificaton', payload)
      commit('showNotification', payload)
    }
  },

  mutations: {
    pushNoficiation(state, notif) {
      state.notificationQueue.push(notif)
    },
    showNotification(state, payload) {
      state.notification.text = payload.text
      state.notification.multiline = (payload.text.length > 50) ? true : false

      if (payload.multiline) {
        state.notification.multiline = payload.multiline
      }

      if (payload.timeout) {
        state.notification.timeout = payload.timeout
      }

      state.notification.indeterminate = payload.indeterminate === true ? true : false
      state.notification.close = payload.close === false ? false : true

      state.notification.visible = true
    },
    closeNotification(state) {
      state.notification.visible = false
      state.notification.multiline = false
      state.notification.timeout = 6000
      state.notification.text = null
    },
  }

});
