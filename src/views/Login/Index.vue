<template>
  <v-layout>
    <v-flex
      xs12
      sm8
      offset-sm2>
      <v-card>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Connect your account to UDS</h3>
            <div>{{ card_text }}</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn @click="login">
            <v-icon>person</v-icon>Sign in with Google
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
/* ============
 * Login Index Page
 * ============
 *
 * Page where the user can login.
 */

import GoogleLogo from '@/components/GoogleLogo.vue'

export default {
  /**
   * The name of the page.
   */
  name: 'LoginIndex',

  /**
   * The components the page can use.
   */
  components: {
    GoogleLogo
  },

  /**
   * The data that can be used by the page.
   *
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      user: {
        email: null,
        password: null
      },
      card_text: 'UDS needs access to your entire Drive.'
    };
  },

  /**
   * The methods the page can use.
   */
  methods: {
    /**
     * Will log the user in.
     *
     * @param {Object} user The user to be logged in.
     */
    login() {
      this.$store.dispatch('auth/login');
    }
  }
};
</script>
