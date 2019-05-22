<template>
  <v-snackbar
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.multiline === true"
    top>

    {{ snackbar.text }}

    <v-btn
      flat
      dark
      @click="closeSnackbar">Close</v-btn>

  </v-snackbar>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    snackbar() {
      return this.$store.state.files.progress
    }
  },
  methods: {
    ...mapMutations(['closeSnackbar'])
  }
}
</script>
