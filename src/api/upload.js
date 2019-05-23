import {
  drive,
  createFolder,
  uploadFile,
  sleep,
  byteFormat,
  getUDSRoot
} from './utils'

import store from '../store'
import uuid from 'uuid'
import { create } from 'domain';

/**
 * Handles the upload of a single file. This is a self contained
 * function that may have to be changed in order to support resumable
 * transfers.
 *
 * @param {HTMLFileInput} file
 */
export const upload = async (fileInput) => {
  // Unique transfer ID
  const transferId = uuid.v4()

  const file = fileInput.files[0]

  store.dispatch("notification", {
    text: `Uploading ${file.name}...`,
    button: 'viewTransfers'
  })


  const fileSize = file.size;
  const chunkSize = 750 * 1024; // bytes
  const parts = Math.ceil(fileSize / chunkSize)
  let uploads = 0
  let offset = 0;
  const chunkReaderBlock = null;
  let parent = 'root'

  const fireUploadProgressEvent = (args = {}) => store.dispatch('files/progress', {
    type: 'upload',
    transferId,
    ...args
  })

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
      /*store.dispatch('files/uploadProgress', {
        id: parent,
        name: file.name,
        uploaded: Math.ceil(offset / chunkSize),
        total: parts,
        finished: true,
        transferId
      })*/
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
        fireUploadProgressEvent()
      })
      .catch((e) => uploadChunk(chunk, part))
  }

  /**
   * files/progress tells Vuex a new transfer has begun
   */
  fireUploadProgressEvent({
    name: file.name,
    parts_total: parts
  })

  /**
   * The properties to attach to the drive folder
   */
  const properties = {
    uds: true,
    size: byteFormat(fileSize),
    size_numeric: fileSize,
    encoded_size: fileSize * (4 / 3),
    parts,
    mimeType: file.type,
    finished: false
  }

  let root = store.state.files.root

  if (!root) {
    root = await getUDSRoot()
  }

  createFolder({
    name: file.name,
    parent: root,
    properties
  }).then((response) => {
    console.log(response)
    parent = response.result.id

    fireUploadProgressEvent({
      id: parent,
      dontIncrement: true
    })

    readChunk(offset, chunkSize, file)
  })
}

export default {
  upload
}
