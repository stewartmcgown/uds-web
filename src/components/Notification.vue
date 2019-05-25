<template>
  <v-snackbar
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :multi-line="snackbar.multiline === true"
    bottom
    left
  >
    <!--<v-progress-circular color="info" :indeterminate="true" v-if="snackbar.indeterminate"></v-progress-circular>-->
    <v-icon v-if="icon" color="white">{{ icon }}</v-icon>
    &nbsp;
    {{ snackbar.text }}
    <v-btn flat dark @click="closeNotification" v-if="snackbar.close">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  computed: {
    snackbar() {
      
      return this.$store.state.notification;
    
    },
    icon() {
      return this.snackbar.icon
    }
  },
  methods: {
    closeNotification() {
      this.$store.dispatch('closeNotification')
    }
  }
};
</script>
