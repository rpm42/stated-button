<template>
  <div class="inputText">
    <input type="text"
      :class="view.styleClass"
      v-stream:input="input$"
      @blur="$fsm.signal('blur')"
      @focus="$fsm.signal('focus')"
      >
    <div class="error-message" v-if="view.showError && error">
      {{ error }}
    </div>
  </div>
</template>
<script>
import { Subject } from 'rxjs'
import { map, debounceTime, distinctUntilChanged, tap, pluck } from 'rxjs/operators'
import * as validators from '@/utils/validators'
export default {
  name: 'InputText',
  props: {
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      error: ''
    }
  },
  stateMachine: {
    init: 'INIT',
    transitions: {
      INIT: {
        focus: 'FOCUSED'
      },
      FOCUSED: {
        valid: 'INPUT_VALID',
        invalid: 'INPUT_INVALID',
        blur() {
          return this.required ? 'INVALID' : 'INIT'
        }
      },
      INPUT_VALID: {
        blur: 'VALID',
        valid: 'INPUT_VALID',
        invalid: 'INPUT_INVALID',
        empty: 'FOCUSED'
      },
      INPUT_INVALID: {
        blur: 'INVALID',
        valid: 'INPUT_VALID',
        invalid: 'INPUT_INVALID',
        empty: 'FOCUSED'
      },
      VALID: {
        focus: 'INPUT_VALID'
      },
      INVALID: {
        focus: 'INPUT_INVALID'
      }
    },
    actions() {
      const setMethod = f => {
        return [tap(({ data }) => f(data))]
      }
      return [['*', ['invalid', 'empty'], setMethod(this.setError)], ['*', 'valid', setMethod(this.setValue)]]
    }
  },
  states: {
    INIT: {
      styleClass: '',
      showError: false
    },
    FOCUSED: {
      styleClass: 'focused',
      showError: false
    },
    INPUT_VALID: {
      styleClass: 'valid',
      showError: false
    },
    INPUT_INVALID: {
      styleClass: 'focused',
      showError: false
    },
    VALID: {
      styleClass: 'valid',
      showError: false
    },
    INVALID: {
      styleClass: 'error',
      showError: true
    }
  },
  methods: {
    setError(error) {
      console.log('setError', error)
      this.error = error
    },
    setValue(value) {
      console.log('setValue', value)
      this.value = value
    }
  },
  subscriptions() {
    this.input$ = new Subject()
    return {
      valid: this.input$.pipe(
        debounceTime(100),
        pluck('event', 'target', 'value'),
        map(value => {
          if (value === '') return { event: 'empty', data: 'should not be empty' }
          if (validators.validEmail(value)) return { event: 'valid', data: value }
          return { event: 'invalid', data: 'should be valid email' }
        }),
        tap(({ event, data }) => {
          this.$fsm.signal(event, data)
        })
      ),
      view: this.$fsm.state$.pipe(distinctUntilChanged(), map(state => this.$options.states[state]))
    }
  }
}
</script>
<style lang="stylus" scoped>
input[type="text"].focused
  border: 2px solid black
input[type="text"].valid
  border: 2px solid green
  background: rgba(green, .2)
input[type="text"].error
  border: 2px solid red
  background: rgba(red, .2)
input[type="text"]
  border: 2px solid grey
  outline: none
  font: 24px Roboto
  padding 8px 16px
  border-radius: 4px
.error-message
  &:before
    content: "-"
  text-align: left
  font: 16px Roboto
  margin: 5px 0 0 5px
  color: red
</style>
