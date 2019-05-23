import {
  gapi,
  drive,
  sleep,
} from './utils'

import store from '../store'

export const deleteBatch = async (ids) => {
  const batch = (await gapi()).client.newBatch()
  const d = await drive()

  for (const fileId of ids) {
    batch.add(d.files.update({
      fileId,
      resource: {
        trashed: true
      },
      fields: 'id, trashed'
    }))
  }

  store.dispatch("notification", {
    text: `Deleting ${ids.length} files...`
  })

  return batch.then(r => {
    store.dispatch("notification", {
      text: `Deleted ${ids.length} files!`
    })
    store.dispatch('files/list', {
      q: ''
    })
  })
}

export default {
  deleteBatch
}
