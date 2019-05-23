<template>
  <div :class="className" v-if="finished !== true">
    <v-progress-linear :value="progress" :indeterminate="indeterminate === true"/>

    <span>{{name}}</span>
    : {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    name: String,
    type: String,
    parts_completed: Number,
    parts_total: Number,
    message: String,
    indeterminate: Boolean,
    finished: Boolean
  },
  computed: {
    progress() {
      return (this.parts_completed / this.parts_total) * 100;
    },
    className() {
      return `transfer ${this.type}`;
    }
  }
};
</script>

<style scoped>
.transfer {
}
</style>
