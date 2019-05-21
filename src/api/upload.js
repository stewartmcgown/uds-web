import {
  drive,
  createFolder,
  uploadFile
} from './utils'

/**
 * 
 * @param {HTMLFileInput} file
 */
export const upload = async (file) => {
  file = file.files[0]
  let fileSize = file.size;
  let chunkSize = 750 * 1024; // bytes
  let offset = 0;
  let part = 0
  let chunkReaderBlock = null;
  let parent = 'root'

  const readEventHandler = (evt) => {
    if (evt.target.error == null) {
      offset += evt.loaded
      uploadChunk(evt.target.result); // callback for handling read chunk
    } else {
      console.log("Read error: " + evt.target.error);
      return;
    }
    if (offset >= fileSize) {
      console.log("Done reading file");
      return;
    }

    part++
    // of to the next chunk
    readChunk(offset, chunkSize, file, part);
  }

  // Fetch parent file itself
  const readChunk = (_offset, length, _file) => {
    const r = new FileReader()
    const blob = _file.slice(_offset, length + _offset)
    r.onload = readEventHandler
    r.readAsArrayBuffer(blob)
  }

  const uploadChunk = (chunk) => {
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
      .then(r => console.log(r))
  }

    const properties = {
        uds: true,
        size: fileSize,
        encoded_size: fileSize * (4 / 3)
    }

    createFolder({ name: file.name, parent: '12V_eXUKlDZhZ1BVRWWPerwBzTDl5fmTX', properties }).then(response => {
        console.log(response)
        parent = response.result.id

        readChunk(offset, chunkSize, file)
    })

}

export default {
  upload
}
