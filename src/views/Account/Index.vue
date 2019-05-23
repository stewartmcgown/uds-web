<template>
  <v-card>
    <v-card-title>Your Account</v-card-title>
    <v-card-text>
      <v-layout row wrap>
        <v-flex md4>
          <h4>Storage Saved</h4>
          <v-progress-circular :indeterminate="true" v-if="!saved" />
          <span v-if="saved">{{ saved }}</span>
        </v-flex>
        <v-flex md4>
          <h4>View files in drive</h4>
          <v-btn :href="filesLink" target="_blank" color="info" :disabled="root === ''">Open</v-btn>
        </v-flex>
      </v-layout>
      
    </v-card-text>
    <div slot="footer">Contribute to this on GitHub.</div>
  </v-card>
</template>

<script>
import { byteFormat } from '@/api/utils'

export default {
  /**
   * The name of the page.
   */
  name: "AccountIndex",

  /**
   * The components that the page can use.
   */
  components: {},
  data() {
    return {};
  },

  computed: {
    root() {
      return this.$store.state.files.root;
    },
    filesLink() {
      return `https://drive.google.com/drive/folders/${this.root}`;
    },
    saved() {
      return byteFormat(this.$store.state.files.storage)
    }
  },
  mounted() {
    this.$store.dispatch("files/getStorage")
  }
};
</script>
