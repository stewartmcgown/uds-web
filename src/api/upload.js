import {
  drive,
  createFolder,
  uploadFile,
  sleep,
  byteFormat
} from './utils'

import store from '../store'

/**
 *
 * @param {HTMLFileInput} file
 */
export const upload = async (file) => {
  file = file.files[0]
  const fileSize = file.size;
  const chunkSize = 750 * 1024; // bytes
  const parts = Math.ceil(fileSize / chunkSize)
  let uploads = 0
  let offset = 0;
  const chunkReaderBlock = null;
  let parent = 'root'

  const readEventHandler = (evt) => {
    if (evt.target.error == null) {
      const size = Math.ceil(offset / chunkSize)
      offset += evt.loaded
      uploadChunk(evt.target.result, size); // callback for handling read chunk
    } else {
      console.log(`Read error: ${evt.target.error}`);
      return;
    }
    if (offset >= fileSize) {
      store.dispatch('files/uploadProgress', { id: parent, name: file.name, uploaded: Math.ceil(offset / chunkSize), total: parts, finished: true })
      return;
    }
    // of to the next chunk
    readChunk(offset, chunkSize, file);
  }

  // Fetch parent file itself
  const readChunk = (_offset, length, _file) => {
    const r = new FileReader()
    const blob = _file.slice(_offset, length + _offset)
    r.onload = readEventHandler
    r.readAsArrayBuffer(blob)
  }

  const uploadChunk = async (chunk, part) => {
    while (uploads > 5) {
      await sleep(500)
    }

    uploads++

    uploadFile({
      name: `${file.name}.${part}`,
      parent,
      properties: {
        part
      },
      body: {
        body: chunk,
        mimeType: 'text/plain'
      }
    })
      .then((r) => {
        uploads--
        store.dispatch('files/uploadProgress', { id: parent, name: file.name, uploaded: part, total: parts })
      })
      .catch((e) => {
        uploads--
        return uploadChunk(chunk, part)
      })
  }

  const properties = {
    uds: true,
    size: byteFormat(fileSize),
    size_numeric: fileSize,
    encoded_size: fileSize * (4 / 3),
    parts,
    mimeType: file.type,
    finished: false
  }

    store.dispatch('files/uploadProgress', {id: parent, name: file.name})

  createFolder({ name: file.name, parent: '12V_eXUKlDZhZ1BVRWWPerwBzTDl5fmTX', properties }).then((response) => {
    console.log(response)
    parent = response.result.id

    readChunk(offset, chunkSize, file)
  })
}

export default {
  upload
}
