<template>
  <v-snackbar
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.multiline === true"
    bottom
    left
  >
    <v-progress-circular color="info" :indeterminate="true" v-if="snackbar.indeterminate"></v-progress-circular>
    {{ snackbar.text }}
    <v-btn flat dark @click="closeNotification" v-if="snackbar.close">
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  computed: {
    snackbar() {
      return this.$store.state.notification;
    }
  },
  methods: {
    ...mapMutations(["closeNotification"])
  }
};
</script>
