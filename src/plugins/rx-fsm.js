import Vue from 'vue'
import { Subject, BehaviorSubject, Observable, Subscription } from 'rxjs'
import { map, filter, concatMap, withLatestFrom, tap } from 'rxjs/operators'
import { assert, isArray, isFunc, isObject, isString } from '@/utils/assert'

class Transitions {
  constructor(T, A, vm) {
    if (isFunc(T)) T = T.bind(vm).call()
    assert(isObject(T), 'invalid transitions format')
    if (isFunc(A)) A = A.bind(vm).call()
    assert(isArray(A), 'invalid actions format')

    this._stateSet = new Set(Object.keys(T))
    this._eventSet = new Set()
    this.$vm = vm

    this.T = T
    for (let s in T) {
      const tt = T[s]
      assert(isObject(tt), 'invalid transitions format')
      for (let e in tt) {
        const n = tt[e]
        if (isString(n)) assert(this._stateSet.has(n), `state '${n}' is not defined in transitions`)
        else {
          assert(isFunc(n), `next state should be name of next state or func returning this name`)
        }
        this._eventSet.add(e)
      }
    }

    this.F = {}
    for (let a of A) {
      let [ss, ee, ff] = a
      assert(isArray(ff), 'action should be array of pipable-operators')
      if (ss === '*') ss = Object.keys(T)
      else if (isString(ss)) ss = [ss]
      assert(isArray(ss), 'invalid state format in action definition')
      for (let s of ss) {
        assert(T[s], `state '${s}' not found`)
        if (ee === '*') ss = Object.keys(T[s])
        else if (isString(ee)) ee = [ee]
        assert(isArray(ee), 'invalid event format in action definition')
        for (let e of ee) {
          assert(isString(e) && e, `invalid event name`)
          if (!T[s][e]) continue
          if (!this.F[s]) this.F[s] = {}
          this.F[s][e] = ff
        }
      }
    }
  }

  hasTransition(s, e) {
    return this.T[s] && this.T[s][e]
  }

  hasAction(s, e) {
    return this.F[s] && this.F[s][e]
  }

  hasState(s) {
    return this._stateSet.has(s)
  }

  hasEvent(e) {
    return this._eventSet.has(e)
  }

  nextState(s, e) {
    if (!this.hasTransition(s, e)) return undefined
    return this.T[s][e]
  }

  getAction(s, e) {
    if (!this.hasAction(s, e)) return undefined
    return this.F[s][e]
  }
}

class StateMachine {
  constructor(vm) {
    const opt = vm.$options.stateMachine
    const T = new Transitions(opt.transitions, opt.actions, vm)
    assert(T.hasState(opt.init), 'initial state not found')
    this._state = opt.init
    this.transitions = T
    this.state$ = new BehaviorSubject(opt.init)
    this.event$ = new Subject()
    this._subscription = new Subscription()
    this.$vm = vm

    const nextState$ = this.event$.pipe(
      withLatestFrom(this.state$),
      map(([e, s]) => {
        return {
          event: e.event,
          data: e.data,
          state: s,
          $vm: vm
        }
      }),
      filter(v => T.hasTransition(v.state, v.event)),
      map(v => {
        let next = T.nextState(v.state, v.event)
        if (isFunc(next)) next = next.bind(vm).call()
        v.nextState = next
        return v
      }),
      concatMap(v => {
        let action = T.getAction(v.state, v.event)
        if (action === undefined) return Observable.of(v)
        return Observable.of(v).pipe(...action)
      }, v => v),
      map(v => v.nextState),
      tap(nextState => this.state$.next(nextState))
    )

    this._subscription.add(
      nextState$.subscribe(nextState => {
        console.log(`${this._state} => ${nextState}`)
        this._state = nextState
      })
    )
  }

  get state() {
    return this._state
  }

  signal(event, data) {
    this.event$.next({ event, data })
  }

  free() {
    if (this._subscription) {
      this._subscription.unsubscribe()
    }
  }
}

const mixin = {
  created() {
    if (this.$options.stateMachine) this.$fsm = new StateMachine(this)
  },
  beforeDestroy() {
    if (this.$fsm) this.$fsm.free()
  }
}

export default function RxFsm(Vue) {
  Vue.mixin(mixin)
}

// auto install
if (typeof Vue !== 'undefined') {
  Vue.use(RxFsm)
}
