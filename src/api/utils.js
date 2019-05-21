import Vue from 'vue'
import MultiPartBuilder from './multipart'

// eslint-disable-next-line max-len
export const drive = () => new Promise(resolve => new Vue().$getGapiClient().then(gapi => resolve(gapi.client.drive)))

export const createFolder = ({name, parent, properties}) => drive().then(d => d.files.create({ resource: {
  name,
  mimeType : 'application/vnd.google-apps.folder',
  parents: [parent],
  properties
}}))

export const uploadFile = ({name, parent, properties, body, mimeType}) => {
    
    const path = '/upload/drive/v3/files', method = 'POST'
    
    const metadata = { mimeType: 'application/vnd.google-apps.document', name: name, parents: [parent], properties }

    const content = arrayBufferToBase64(body.body)

    const multipart = new MultiPartBuilder()
        .append('application/json', JSON.stringify(metadata))
        .append('text/plain', content)
        .finish()

    return new Vue().$getGapiClient()
    .then(gapi => gapi.client.request({
        path: path,
        method: method,
        params: {
            uploadType: 'multipart',
        },
        headers: { 'Content-Type': multipart.type },
        body: multipart.body
    }))}

 /*
MIT LICENSE
Copyright 2011 Jon Leighton
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export const arrayBufferToBase64 = (arrayBuffer) => {
  let base64    = ''
  let encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  let bytes         = new Uint8Array(arrayBuffer)
  let byteLength    = bytes.byteLength
  let byteRemainder = byteLength % 3
  let mainLength    = byteLength - byteRemainder

  let a, b, c, d
  let chunk

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}

export default {
  drive,
  createFolder,
  uploadFile,
  arrayBufferToBase64
}
