<template>
  <div class="hello">
    <h3 v-text="msg"></h3>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<style scoped lang="less"></style>
