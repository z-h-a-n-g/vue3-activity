const targetMap = new WeakMap()
let activeEffect = null

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
      let result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set (target, key, value, receiver) {
      let oldValue = target[key]
      Reflect.set(target, key, value, receiver)
      if (oldValue !== value) {
        trigger(target, key)
      }
    }
  }
  return new Proxy(target, handler)
}

const ref = (raw) => {
  const r = {
    get value () {
      track(r, "value")
      return raw
    },
    set value (newVal) {
      if (newVal != raw) {
        raw = newVal
        trigger(r, 'value')
      }
    },
  }
  return r
}

const computed = (getter) => {
  let result = ref()
  effect(() => result.value = getter())
  return result
}

const product = reactive({ price: 5, quantity: 2, a: 1 })
let salePrice = computed(() => {
  return product.price * 0.9
})
let total = computed(() => {
  return salePrice.value * product.quantity
})

console.log(`Before update total (should be 10) = ${total.value} salePrice (should be 4.5) = ${salePrice.value}`)
product.quantity = 3
console.log(`After update total (should be 15) = ${total.value} salePrice (should be 4.5) = ${salePrice.value}`)
product.price = 10
console.log(`After update total (should be 30) = ${total.value} salePrice (should be 9) = ${salePrice.value}`)