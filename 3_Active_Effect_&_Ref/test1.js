const targetMap = new WeakMap()
const activeEffect = null

const effect = (eff) => {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

const track = (target, key) => {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    dep.add(activeEffect)
  }
}

const trigger = (target, key) => {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach(eff => eff())
  }
}

const reactive = (target) => {
  const handler = {
    get (target, key, receiver) {
      console.log(`get ${key} -- ${target[key]}`)
      let result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set (target, key, value, receiver) {
      console.log(`set ${key} --oldValue: ${target[key]} --newValue:${value}`)
      let oldValue = target[key]
      let result = Reflect.set(target, key, value, receiver)
      if (oldValue !== result) {
        trigger(target, key)
      }
    }
  }
  return new Proxy(target, handler)
}


effect(() => {
  total = product.price * product.quantity
})