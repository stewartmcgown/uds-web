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

/**
 * Manages maximum memory usage
 */
const MAX_CHUNKS = 5

/**
 * Amount of binary data you can fit in one Google Doc
 * 
 * Equates to roughly one million base64 characters
 */
const CHUNK_SIZE = 750 * 1024


/**
 * Rework of upload function to be better
 */
export class Uploader {
  constructor(fileInput) {
    // Create unique ID
    this.transferId = uuid.v4()

    this.file = fileInput.files[0]

    /**
     * The total number of parts needed to store this file
     * 
     * @type {Number}
     */
    this.parts_total = Math.ceil(this.file.size / CHUNK_SIZE)

    /**
     * The number of bytes read by the FileReader
     * 
     * @type {Number}
     */
    this.offset = 0

    this.loaded_chunks = 0
  }

  /**
   * Reading chunks should only be done whilst we have no exceede
   */
  async readChunk() {
    while (this.loaded_chunks >= MAX_CHUNKS) {
      await sleep(500)
    }

    this.loaded_chunks++
    const r = new FileReader()
    const blob = this.file.slice(this.offset, CHUNK_SIZE + this.offset)
    r.onload = this.processChunk
    r.readAsArrayBuffer(blob)
  }

  async processChunk(evt) {
    if (evt.target.error == null) {
      const size = Math.ceil(offset / chunkSize)
      offset += evt.loaded
      uploadChunk(evt.target.result, size)
    } else {
      console.log(`Read error: ${evt.target.error}`);
      return
    }
    if (offset >= fileSize) {  
      return
    }

    this.readChunk()
  }

  uploadChunk(chunk, part) {
    uploadFile({
      name: `${this.file.name}.${part}`,
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

  upload() {

  }

  fireUploadProgressEvent(args = {}) {
    store.dispatch('files/progress', {
      type: 'upload',
      transferId: this.transferId,
      ...args
    })
  }
}

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
  const MAX_CHUNKS = 5
  let currentLoadedChunks = 0
  let offset = 0;
  const chunkReaderBlock = null;
  let parent = 'root'

  const fireUploadProgressEvent = (args = {}) => store.dispatch('files/progress', {
    type: 'upload',
    transferId,
    ...args
  })

  const readEventHandler = async (evt) => {
    while (store.state.files.chunk_count >= MAX_CHUNKS) {
      await sleep(500)
    }

    if (evt.target.error == null) {
      store.dispatch('files/chunkEvent', true)
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
    .catch((e) => uploadChunk(chunk, part))
    .then((r) => {
        store.dispatch('files/chunkEvent', false)
        fireUploadProgressEvent()
      })
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
