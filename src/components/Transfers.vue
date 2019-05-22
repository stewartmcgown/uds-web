<template>
  <div class="transfers">
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-0">Uploads</h3>
      </v-card-title>
      <transfer
        v-for="upload in uploads"
        :key="upload.id"
        v-bind="upload"/>
    </v-card>

    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-0">Downloads</h3>
      </v-card-title>
      <transfer
        v-for="download in downloads"
        :key="download.id"
        v-bind="download"/>
    </v-card>
  </div>
</template>

<script>
import Transfer from '@/components/Transfer.vue'

export default {
  components: {
    Transfer
  },
  computed: {
    uploads() {
      return Object.values(this.$store.state.files.uploads)
    },
    downloads() {
      return Object.values(this.$store.state.files.downloads)
    }
  }
}
</script>

<style>

</style>
