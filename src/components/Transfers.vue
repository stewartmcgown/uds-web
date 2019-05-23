<template>
    <v-layout row wrap>
      <v-flex md6>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">Uploads</h3>
          </v-card-title>
          <v-card-text>
            <transfer v-for="upload in uploads" :key="upload.transferId" v-bind="upload"/>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex md6>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">Downloads</h3>
          </v-card-title>
          <v-card-text>
            <transfer v-for="download in downloads" :key="download.transferId" v-bind="download"/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
</template>

<script>
import Transfer from "@/components/Transfer.vue";

export default {
  components: {
    Transfer
  },
  computed: {
    uploads() {
      return Object.values(this.$store.state.files.uploads);
    },
    downloads() {
      return Object.values(this.$store.state.files.downloads);
    }
  }
};
</script>

<style scoped>
</style>
