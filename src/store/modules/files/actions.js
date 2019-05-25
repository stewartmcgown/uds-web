/* ============
 * Actions for the files module
 * ============
 *
 * The actions that are available on the
 * files module.
 */

import api from '@/api/'

import Vue from 'vue';
import * as types from './mutation-types';

export const list = ({
  commit,
  dispatch
}, {
  q = ''
}) => {
  dispatch('notification', {
    text: 'Loading your files',
    indeterminate: true,
  }, {root: true})

  let query = "properties has {key='uds' and value='true'} and trashed=false" // and properties has {key='finished' and value='true'}
  if (q != '') query += ` and fullText contains '${q}'`

  new Vue().$getGapiClient()
    .then(gapi => gapi.client.drive.files.list({
      q: query,
      pageSize: 20,
      fields: 'nextPageToken, files(id, name, properties, mimeType, createdTime)'
    }))
    .then((response) => {
      commit(types.FILES, response.result.files)
      commit('closeNotification', {}, { root: true })
    })
    .catch((error) => {
      console.log(error)
    })
};

export const deleteBatch = ({
  commit
}, {
  ids
}) => {
  api.deleteBatch(ids)
}

export const download = ({
  commit
}, {
  id
}) => {
  api.download(id)
}

export const downloadBatch = ({
  commit
}, {
  ids
}) => {
  for (const id of ids) {
    api.download(id)
  }
}

export const upload = ({
  commit
}, {
  filereader
}) => {
  api.upload(filereader)
}

export const progress = ({
  commit
}, payload) => commit(types.PROGRESS, payload)

export const downloadProgress = ({
  commit
}, {
  id,
  name,
  downloaded,
  total,
  finished = false
}) => {
  commit(types.DOWNLOAD_PROGRESS, {
    id,
    name,
    downloaded,
    total,
    finished
  })
}

export const incrementConnections = ({
  commit
}) => commit(types.CONNECTIONS, 1)

export const decrementConnections = ({
  commit
}) => commit(types.CONNECTIONS, -1)

export const setRoot = ({
  commit
}, id) => commit(types.SET_ROOT, id)

export const getRoot = ({
  commit
}, id) => api.utils.getUDSRoot()

export const getStorage = ({
  commit,
  state
}) => {
  api.utils.getUDSRoot()
    .then(id => api.utils.recursiveList(id))
    .then(files => {
      const bytes = files.reduce((r, f) => r += Number.parseInt(f.properties.size_numeric), 0)
      commit(types.SET_STORAGE, bytes)
  })
}

export const setFinished = ({
  commit
}, id) => api.utils.setFinished(id)

export const chunkEvent = ({ commit }, increment) => commit(types.CHUNK_COUNT, increment)

export default {
  list,
  deleteBatch,
  download,
  downloadBatch,
  upload,
  downloadProgress,
  incrementConnections,
  decrementConnections,
  progress,
  setRoot,
  getRoot,
  getStorage,
  setFinished,
  chunkEvent
};
