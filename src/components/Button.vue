<template>
  <button class="stated-button" 
    :class="view.style"
    :disabled="view.disabled"
    v-stream:click="plus$"
    >
    {{ view.caption }}
    {{ count }}
  </button>
</template>

<script>
import { Subject, Observable } from 'rxjs'
import { map, startWith, scan } from 'rxjs/operators'

export default {
  name: 'HelloWorld',
  states: {
    INIT: {
      style: 'stated-button_disabled',
      caption: 'pending...',
      disabled: true
    },
    ACTIVE: {
      style: 'stated-button_active',
      caption: 'active',
      disabled: false
    },
    ERROR: {
      style: 'stated-button_error',
      caption: 'error',
      disabled: true
    }
  },
  transitions: {
    INIT: {
      'request-success': ['ACTIVE'],
      'request-failed': ['ERROR']
    },
    ACTIVE: {
      'request-failed': ['ERROR']
    },
    ERROR: {
      'request-success': ['ACTIVE']
    }
  },
  data() {
    return {}
  },
  mounted() {
    console.log('created', this.$observables.request$)
    // const request = new Observable.create(this.request)
    // this.$observables.request$.subscribe(this.stateChange)
    this.$subscribeTo(this.$observables.request$, this.stateChange)
  },
  destroyed() {
    console.log('destroyed')
    if (this.timeoutId) clearTimeout(this.timeoutId)
  },
  methods: {
    request(observer) {
      this.timeoutId = setTimeout(() => {
        if (Math.round(Math.random() * 10) > 6) {
          observer.next({
            event: 'request-failed',
            data: null
          })
        } else {
          observer.next({
            event: 'request-success',
            data: null
          })
        }
        this.request(observer)
      }, 3000)
    },
    stateChange({ event, data }) {
      console.log('stateChange', event, data)
      const currentState = this.$store.state.button
      const transition = this.$options.transitions[currentState][event]
      if (transition && transition.length > 0) {
        const nextState = transition[transition.length - 1]
        this.$store.dispatch('setState', nextState)
      }
    }
  },
  subscriptions() {
    console.log('subscriptions')
    this.plus$ = new Subject()
    return {
      request$: new Observable.create(this.request),
      count: this.plus$.pipe(
        map(() => 1),
        startWith(0),
        scan((total, change) => total + change)
      )
    }
  },
  computed: {
    state() {
      return this.$store.state.button
    },
    view() {
      return this.$options.states[this.state]
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
  border-radius: 3px
  text-transform: uppercase
  justify-content: center
  align-items: center
  padding: 12px 25px
  min-width: 150px
  outline: none
  &:hover:enabled
    background: lighten(#ddd, 20%)
    border-color: lighten(#999, 30%)

.stated-button_active
  color: white
  background: #009900
  border-color: #229922
  &:hover:enabled
    background: lighten(#009900, 20%)
    border-color: lighten(#229922, 30%)

.stated-button_disabled
  color: #aaa
  border-color: #ccc

.stated-button_error
  color: white
  background: #990000
  border-color: #992222
  &:hover:enabled
    background: lighten(#990000, 20%)
    border-color: lighten(#992222, 30%)
</style>
