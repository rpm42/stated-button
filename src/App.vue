<template>
  <div id="app">
    <div class="block">
      <Input/>
    </div>
  </div>
</template>

<script>
import Input from './components/Input'

export default {
  name: 'App',
  components: {
    Input
  }
}
</script>

<style lang="stylus">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px
.block
  display: flex
.mt
  margin-top: 20px
</style>
