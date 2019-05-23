/* ============
 * Mutations for the files module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import Vue from 'vue';
import { stat } from 'fs';
import {
  FILES,
  UPLOAD_PROGRESS,
  DOWNLOAD_PROGRESS,
  CONNECTIONS,
  SHOW_SNACKBAR,
  CLOSE_SNACKBAR
} from './mutation-types';

/* eslint-disable no-param-reassign */
export default {
  [FILES](state, files) {
    state.files = files
  },
  [UPLOAD_PROGRESS](state, { name, id, uploaded, total, part, finished, isReading = true }) {
    const upload = state.uploads[id]
    if (upload && (finished || upload.uploaded === total)) {
      Vue.delete(state.uploads, id)
    } else if (upload && !finished) {
      upload.uploaded += 1
      upload.snackbar_text = `${name}: Uploaded ${upload.uploaded} of ${total} parts...`
    } else {
      Vue.set(state.uploads, id, { name, id, uploaded: 0, total, part })

      const text = `${name}: Starting upload...`

      state.uploads[id].snackbar_text = text

      state.snackbar.visible = true
      state.snackbar.text = text
    }
  },
  [DOWNLOAD_PROGRESS](state, { name, id, downloaded, total, part, finished }) {
    const download = state.downloads[id]
    if (download) console.log(`${download.downloaded} ${download.total}`)
    if (download && (finished || download.downloaded === download.total)) {
      Vue.delete(state.downloads, id)
    } else if (download && !finished) {
      download.downloaded += 1
      download.snackbar_text = `${name}: Downloaded ${download.downloaded} of ${download.total} parts...`

      if (download.downloaded >= download.total) {
        download.finished = true
      }
    } else {
      Vue.set(state.downloads, id, { name, id, downloaded: 0, total, part })
      const text = `${name}: Starting download...`

      state.downloads[id].snackbar_text = text

      state.snackbar.visible = true
      state.snackbar.text = text
    }
  },
  [CONNECTIONS](state, inc) {
    state.connections += inc
  },
  [SHOW_SNACKBAR](state, payload) {
      state.snackbar.text = payload.text
      state.snackbar.multiline = (payload.text.length > 50)

      if (payload.multiline) {
        state.snackbar.multiline = payload.multiline
      }

      if (payload.timeout) {
        state.snackbar.timeout = payload.timeout
      }

      state.snackbar.visible = true
    },
  [CLOSE_SNACKBAR](state) {
      state.snackbar.visible = false
      state.snackbar.multiline = false
      state.snackbar.timeout = 6000
      state.snackbar.text = null
    },
};
