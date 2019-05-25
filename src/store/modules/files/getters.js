/* ============
 * Getters for the files module
 * ============
 *
 * The getters that are available on the
 * files module.
 */

export const transfers = (state) => {
    let count = 0
    Object.values(state.uploads).forEach(n => !n.finished ? count++ : 0)
    Object.values(state.downloads).forEach(n => !n.finished ? count++ : 0)
    return count
} 

export default {
    transfers
};
