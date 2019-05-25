/* ============
 * State of the files module
 * ============
 *
 * The initial state of the files module.
 */

export default {
  files: [],
  snackbar: {
    visible: false,
    text: '',
    timeout: 60000
  },
  uploads: {},
  downloads: {},
  connections: 0,
  root: '',
  storage: 0,
  chunk_count: 0
};
