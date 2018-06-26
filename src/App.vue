<template>
  <div id="app">
    <div class="block">
      <Button/>
    </div>
    <div class="block mt">
      <button>1</button>
      <button>2</button>
    </div>
  </div>
</template>

<script>
import Button from './components/Button'

export default {
  name: 'App',
  components: {
    Button
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
