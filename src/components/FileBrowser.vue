<template>
  <div class="filebrowser">
    <searchbar v-on:search="search"/>
    <file-toolbar @delete="_delete" @download="downloadBatch"/>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="files"
      :rows-per-page-items="rows_per_page_items"
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
            />
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
            <v-checkbox
              :input-value="props.selected"
              primary
              hide-details/>
          </td>
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.properties.size }}</td>
          <td class="text-xs-right">{{ props.item.properties.mimeType }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import FileToolbar from '@/components/FileToolbar.vue';
import Searchbar from '@/components/Searchbar.vue'

export default {
  name: 'FileBrowser',
  components: {
    FileToolbar,
    Searchbar
  },
  data: () => ({
    pagination: {
      sortBy: 'name'
    },
    selected: [],
    rows_per_page_items: [15, 30, 45, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }],
    headers: [
      {
        text: 'Name',
        align: 'left',
        value: 'name'
      },
      {
        text: 'Size',
        value: 'size'
      },
      {
        text: 'MimeType',
        value: 'mimeType'
      }
    ]
  }),
  computed: {
    files() {
      return this.$store.state.files.files;
    }
  },
  mounted() {
    this.$store.dispatch('files/list', { q: '' });
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
      this.$store.dispatch('files/download', { id });
    },
    downloadBatch() {
      this.$store.dispatch('files/downloadBatch', { ids: this.selected.map(s => s.id) });
    },
    _delete() {
      this.$store.dispatch('files/deleteBatch', { ids: this.selected.map(s => s.id) })
    },
    search(event) {
      this.$store.dispatch('files/list', { q: event });
    }
  }
};
</script>

<style>
th {
  text-align: left;
}
</style>
