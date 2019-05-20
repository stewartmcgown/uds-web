<template>
  <div class="filebrowser">
    <file-toolbar/>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="files"
      :pagination.sync="pagination"
      select-all
      item-key="id"
      class="elevation-1"
    >
      <template v-slot:headers="props">
        <tr>
          <th>
            <v-checkbox
              :input-value="props.all"
              :indeterminate="props.indeterminate"
              primary
              hide-details
              @click.stop="toggleAll"
            ></v-checkbox>
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
            @click="changeSort(header.value)"
          >
            <v-icon small>arrow_upward</v-icon>
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <tr
          :active="props.selected"
          @click="props.selected = !props.selected"
          @dblclick="download(props.item.id)"
        >
          <td>
            <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
          </td>
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.properties.size }}</td>
          <td class="text-xs-right">{{ props.item.mimeType }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import FileToolbar from "@/components/FileToolbar.vue";

export default {
  name: "FileBrowser",
  components: {
    FileToolbar
  },
  data: () => ({
    pagination: {
      sortBy: "name"
    },
    selected: [],
    headers: [
      {
        text: "Name",
        align: "left",
        value: "name"
      },
      {
        text: "Size",
        value: "size"
      },
      {
        text: "MimeType",
        value: "mimeType"
      }
    ]
  }),
  computed: {
    files() {
      return this.$store.state.files.files;
    }
  },
  mounted() {
    this.$store.dispatch("files/list", { q: "" });
  },
  methods: {
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.files.slice();
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    download(id) {
      this.$store.dispatch("files/download", { id });
    }
  }
};
</script>

<style>
th {
  text-align: left;
}
</style>
