<template>
  <v-app>
    <v-toolbar app>
      <router-link to="/home">
        <v-toolbar-title class="headline text-uppercase">
          <span>Unlimited</span>
          <span class="font-weight-light">&nbsp;Drive Storage</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer/>
      <v-badge right v-if="transfers">
        <template v-slot:badge>
          <span>{{ transfers }}</span>
        </template>
      </v-badge>
      <v-btn flat to="/transfers">
        <span>Transfers</span>
      </v-btn>

      <v-btn flat to="/account">
        <span class="mr-2">Account</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container grid-list-md>
        <router-view/>

        
      </v-container>
    </v-content>

    <notification/>
  </v-app>
</template>

<script>
import notification from "@/components/Notification";

export default {
  name: "App",
  components: {
    notification
  },
  data() {
    return {
      //
    };
  },
  computed: {
    title() {
      return document.title;
    },
    transfers() {
      return this.$store.getters["files/transfers"];
    }
  },
  mounted() {
    this.$store.dispatch("files/getRoot");

    /**
     * TODO:
     *  Implement this
     */
    window.addEventListener("dragenter", () => 0);
  }
};
</script>

<style scoped>
main {
  height: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
