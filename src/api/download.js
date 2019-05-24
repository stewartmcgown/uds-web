import {
  drive,
  recursiveList,
  downloadFile,
  sleep,
  createAndDownloadBlobFile
} from './utils'

import Base64 from './base64'

import store from '../store'
import uuid from 'uuid'

export const download = async (id) => {
  store.dispatch("notification", {
    text: `Starting download...`,
    button: 'viewTransfers'
  })

  const transferId = uuid.v4()

  const fireDownloadProgressEvent = (args = {}) => store.dispatch('files/progress', {
    type: 'download',
    transferId,
    ...args
  })

  // First progress event
  fireDownloadProgressEvent({
    id
  })

  // Fetch parent file itself
  const meta = {}
  const files = await drive()
    .then(d => d.files.get({
      fileId: id,
      fields: 'id, name, properties'
    }))
    .then(response => response.result)
    .then((parent) => {
      meta.parent = parent
      fireDownloadProgressEvent({
        name: parent.name,
        parts_total: Number.parseInt(parent.properties.parts),
        dontIncrement: true
      })
      return recursiveList(parent.id)
    })

  // Verify files
  if (Number.parseInt(meta.parent.properties.parts) !== files.length) {
    // store.dispatch()
    console.error(`[uds] ${meta.parent.properties.parts} !== ${files.length}`)
    fireDownloadProgressEvent({
      isFailure: true,
      finished: true
    })
    return
  }

  const parts_total = Number.parseInt(meta.parent.properties.parts)

  const buffer = new ArrayBuffer(parts_total * 750 * 1024) // malloc
  const uint8buffer = new Uint8Array(buffer)

  for (const file of files) {
    downloadFile(file.id) // Queue downloads
      .then((text) => {
        const textBuffer = Base64.decodeArrayBuffer(text)
        uint8buffer.set(new Uint8Array(textBuffer), file.properties.part * 750 * 1024)
        fireDownloadProgressEvent()
      })
  }

  while (!store.state.files.downloads[transferId].finished) {
    await sleep(100) // Replace this with store fired event
  }

  createAndDownloadBlobFile(uint8buffer, meta.parent.name)
}

export const downloadBatch = (ids) => {
  for (let id of ids) {
    download(id)
  }
}

export default {
  download,
  downloadBatch
}
