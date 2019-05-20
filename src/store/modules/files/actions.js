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
  let query = "properties has {key='uds' and value='true'} and trashed=false"
  if (!!q && q instanceof String) query += `and ${q}`

  new Vue().$getGapiClient()
    .then(gapi => gapi.client.drive.files.list({
      q: query,
      pageSize: 20,
      fields: 'nextPageToken, files(id, name, properties, mimeType)'
    }))
    .then((response) => {
      console.log(response.result.files)
      commit(types.FILES, response.result.files)
    })
    .catch((error) => {
      console.log(error)
    })
};

export const download = ({
  commit
}, {
  id
}) => {
  api.download(id)
}

export const upload = ({
  commit
}, {
  filereader
}) => {
  api.upload(filereader)
}

export default {
  list,
  download,
  upload
};
