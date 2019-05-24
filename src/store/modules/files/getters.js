/* ============
 * Getters for the files module
 * ============
 *
 * The getters that are available on the
 * files module.
 */

export const transfers = (state) => Object.keys(state.uploads).length + Object.keys(state.downloads).length

export default {
    transfers
};
