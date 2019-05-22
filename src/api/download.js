import {
  drive,
  recursiveList,
  downloadFile,
  sleep,
  createAndDownloadBlobFile
} from './utils'

import Base64 from './base64'

import store from '../store'


export const download = async (id) => {
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
      return recursiveList(parent.id)
    })

  // Verify files
  if (Number.parseInt(meta.parent.properties.parts) !== files.length) {
    // store.dispatch()
    console.error(`[uds] ${meta.parent.properties.parts} !== ${files.length}`)
    return
  }

  store.dispatch('files/downloadProgress', { name: meta.parent.name, id, total: Number.parseInt(meta.parent.properties.parts) })

  const buffer = new ArrayBuffer(meta.parent.properties.parts * 750 * 1024)
  const uint8buffer = new Uint8Array(buffer)

  console.log(uint8buffer)
  for (const file of files) {
    downloadFile(file.id)
      .then((text) => {
        const textBuffer = Base64.decodeArrayBuffer(text)
        uint8buffer.set(new Uint8Array(textBuffer), file.properties.part * 750 * 1024)
        store.dispatch('files/downloadProgress', { name: meta.parent.name, id })
      })
  }

  while (!store.state.files.downloads[id].finished) {
    await sleep(100)
  }

  store.dispatch('files/downloadProgress', { name: meta.parent.name, id })

  createAndDownloadBlobFile(uint8buffer, meta.parent.name)
}

export const downloadBatch = () => {

}

export default {
  download,
  downloadBatch
}
