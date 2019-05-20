/* ============
 * Mutations for the files module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import Vue from 'vue';
import {
  FILES
} from './mutation-types';

/* eslint-disable no-param-reassign */
export default {
  [FILES](state, files) {
    state.files = files
  }
};
