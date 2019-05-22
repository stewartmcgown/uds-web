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
  CONNECTIONS
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
      upload.progress_text = `${name}: Uploaded ${upload.uploaded} of ${total} parts...`
    } else {
      Vue.set(state.uploads, id, { name, id, uploaded: 0, total, part })

      const text = `${name}: Starting upload...`

      state.uploads[id].progress_text = text

      state.progress.visible = true
      state.progress.text = text
    }
  },
  [DOWNLOAD_PROGRESS](state, { name, id, downloaded, total, part, finished }) {
    const download = state.downloads[id]
    if (download) console.log(`${download.downloaded} ${download.total}`)
    if (download && (finished || download.downloaded === download.total)) {
      Vue.delete(state.downloads, id)
    } else if (download && !finished) {
      download.downloaded += 1
      download.progress_text = `${name}: Downloaded ${download.downloaded} of ${download.total} parts...`

      if (download.downloaded >= download.total) {
        download.finished = true
      }
    } else {
      Vue.set(state.downloads, id, { name, id, downloaded: 0, total, part })
      const text = `${name}: Starting download...`

      state.downloads[id].progress_text = text

      state.progress.visible = true
      state.progress.text = text
    }
  },
  [CONNECTIONS](state, inc) {
    state.connections += inc
  }
};
