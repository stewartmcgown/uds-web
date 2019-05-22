/* ============
 * State of the files module
 * ============
 *
 * The initial state of the files module.
 */

export default {
  files: [],
  progress: {
    visible: false,
    text: '',
    timeout: 60000
  },
  uploads: {},
  downloads: {},
  connections: 0
};
