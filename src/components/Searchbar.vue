<template>
    <v-text-field
            label="Search"
            v-model="text"
            @change="$emit('search', text)"
            outline
          ></v-text-field>
</template>

<script>
export default {
    data() {
        return {
            text: ""
        }
    }
}
</script>

<style scoped>

</style>
