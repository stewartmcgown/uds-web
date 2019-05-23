<template>
  <v-snackbar
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.multiline === true"
    bottom
    left
  >
    {{ snackbar.text }}
    <v-btn flat dark @click="closeNotification">
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
