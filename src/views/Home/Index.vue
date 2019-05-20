<template>
  <file-browser />
</template>

<script>
/* ============
 * Home Index Page
 * ============
 *
 * The home index page.
 */

import VLayout from "@/layouts/Default.vue";
import FileBrowser from "@/components/FileBrowser.vue"

export default {
  /**
   * The name of the page.
   */
  name: "HomeIndex",

  /**
   * The components that the page can use.
   */
  components: {
    VLayout,
    FileBrowser
  }
};
</script>
