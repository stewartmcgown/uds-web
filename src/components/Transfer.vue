<template>
  <div :class="className">
    <v-progress-circular :value="progress"/> {{ snackbar_text }}
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    name: String,
    type: String,
    uploaded: Number,
    total: Number,
    snackbar_text: String
  },
  computed: {
    progress() {
      return ((this.uploaded || this.downloaded) / this.total) * 100
    },
    className() {
      return `transfer ${this.type}`
    }
  }
}
</script>

<style>

</style>
