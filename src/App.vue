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
      <v-btn flat to="/transfers">
        <span class="mr-2">Transfers</span>
      </v-btn>
      <v-btn flat href="https://github.com/stewartmcgown/uds-web" target="_blank">
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
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
    }
  }
};
</script>

<style scoped>
main {
  margin-top: 16px;
  height: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
