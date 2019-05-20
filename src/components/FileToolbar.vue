<template>
  <div class="file-toolbar">
    <v-btn @click="upload">
      <v-icon>cloud_upload</v-icon>File
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "FileToolbar",
  methods: {
    upload() {
      const f = document.createElement("input");
      f.type = "file";
      f.click();
      f.onchange = () =>
        this.$store.dispatch("files/upload", { filereader: f });
    }
  }
};
</script>

<style>
</style>
