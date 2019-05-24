<template>
  <div class="file-toolbar">
    <v-btn @click="upload" color="info">
      <v-icon>cloud_upload</v-icon>&nbsp;File
    </v-btn>
    <v-btn @click="$emit('download')" color="info">
      <v-icon>cloud_download</v-icon>&nbsp;Download
    </v-btn>
    <v-btn @click="$emit('delete')" color="error">
      <v-icon>delete</v-icon>&nbsp;Delete
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'FileToolbar',
  methods: {
    upload() {
      const f = document.createElement('input');
      f.type = 'file';
      f.click();
      f.onchange = () => this.$store.dispatch('files/upload', { filereader: f });
    }
  }
};
</script>

<style>
</style>
