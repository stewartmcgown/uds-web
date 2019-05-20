import {
  drive
} from './utils'

export const download = async (id) => {
  // Fetch parent file itself
  const meta = {}
  await drive()
    .then(d => d.files.get({
      fileId: id
    }))
    .then((response) => {
      meta.parent = response.result
    })
    .then(drive)
    .then(d => d.files.list({
      q: `'${id}' in parents`,
      fields: 'nextPageToken, files(id, name, properties)'
    }))
    .then((response) => {
      const parts = response.result.files
      meta.parts = parts
    })

  console.log(meta)

  // Process chunks sequentially
}

export const downloadBatch = () => {

}

export default {
  download,
  downloadBatch
}
