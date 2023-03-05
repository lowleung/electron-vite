<template>
  <div class="home">
    <h1>Welcome to Your Electron App</h1>
    <HelloWorld msg="HelloWorld" />
    <a @click="handgleAbout">GO About</a>
  </div>
</template>

<script>
import HelloWorld from '../components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  methods: {
    handgleAbout() {
      this.$router.push({ path: '/about', name: 'about' })
    }
  }
}
</script>
