<template>
  <div class="about">
    <h1>This is an about page</h1>
    <a @click="handgleIndex">GO Index</a>
  </div>
</template>
<script>
  export default {
  name: 'About',
  methods: {
    handgleIndex() {
      this.$router.push({ path: '/', name: 'home' })
    }
  }
}
</script>
