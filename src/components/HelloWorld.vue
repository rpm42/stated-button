<template>
  <button class="stated-button" 
    :class="button.style"
    :disabled="button.disabled">
    {{ button.caption }}
  </button>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'HelloWorld',
  states: {
    init: {
      style: 'stated-button_disabled',
      caption: 'pending...',
      disabled: true
    },
    active: {
      style: 'stated-button_active',
      caption: 'active',
      disabled: false
    },
    error: {
      style: 'stated-button_error',
      caption: 'error',
      disabled: true
    }
  },
  data() {
    return {
      button: {}
    }
  },
  beforeMount() {
    console.log()
    Vue.set(this, 'button', this.$options.states[this.$store.state.state])
  },
  mounted() {
    setTimeout(() => {
      this.$store.dispatch('setState', 'active')
    }, 5000)
    setTimeout(() => {
      this.$store.dispatch('setState', 'error')
    }, 2000)
  },
  watch: {
    '$store.state.state': function(value) {
      console.log(value)
      Vue.set(this, 'button', this.$options.states[value])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.stated-button
  font-size: 14px
  background: #ddd
  border: 2px solid #999
  display: flex
  justify-content: center
  align-items: center
  padding: 12px 25px
  min-width: 150px
  outline: none
  &:hover
    background: lighten(#ddd, 20%)
    border-color: lighten(#999, 30%)

.stated-button_active
  color: white
  background: #009900
  border-color: #229922
  &:hover
    background: lighten(#009900, 20%)
    border-color: lighten(#229922, 30%)

.stated-button_disabled
  color: #aaa
  border-color: #ccc

.stated-button_error
  color: white
  background: #990000
  border-color: #992222
  &:hover
    background: lighten(#990000, 20%)
    border-color: lighten(#992222, 30%)
</style>
