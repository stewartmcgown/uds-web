import {
  drive
} from './utils'

/**
 * 
 * @param {HTMLFileInput} file
 */
export const upload = async (file) => {
  file = file.files[0]
  let fileSize = file.size;
  let chunkSize = 64; // bytes
  let offset = 0;
  let self = this; // we need a reference to the current object
  let chunkReaderBlock = null;

  const readEventHandler = (evt) => {
    if (evt.target.error == null) {
      offset += evt.target.result.length;
      uploadChunk(evt.target.result); // callback for handling read chunk
    } else {
      console.log("Read error: " + evt.target.error);
      return;
    }
    if (offset >= fileSize) {
      console.log("Done reading file");
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
    r.readAsText(blob);
  }

  const uploadChunk = (chunk) => {
    drive()
  }

  readChunk(offset, chunkSize, file)

}

export default {
  upload
}
