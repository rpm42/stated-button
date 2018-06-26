import { Subject } from 'rxjs'
class StateMachine {
  constructor() {
    this.subject = new Subject()
  }
  emit(event, value) {}
}

var stateMachine

StateMachine.install = (Vue, { store }) => {
  stateMachine = new StateMachine(store)
  Vue.app.stateMachine = stateMachine
  Object.defineProperties(Vue.prototype, {
    $stateMachine: {
      get() {
        return stateMachine
      }
    }
  })
}

export default StateMachine
