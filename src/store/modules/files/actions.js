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
  commit
}, {
  q
}) => {
  let query = "properties has {key='uds' and value='true'} and trashed=false" // and properties has {key='finished' and value='true'}
  if (!!q && q instanceof String) query += `and ${q}`

  new Vue().$getGapiClient()
    .then(gapi => gapi.client.drive.files.list({
      q: query,
      pageSize: 20,
      fields: 'nextPageToken, files(id, name, properties, mimeType)'
    }))
    .then((response) => {
      commit(types.FILES, response.result.files)
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


export default {
  list,
  deleteBatch,
  download,
  downloadBatch,
  upload,
  downloadProgress,
  incrementConnections,
  decrementConnections,
  progress
};
