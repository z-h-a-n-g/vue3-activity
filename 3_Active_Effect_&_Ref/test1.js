const targetMap = new WeakMap()
let activeEffect = null

const effect = (eff) => {
  console.warn("执行effect函数")
  activeEffect = eff
  activeEffect()
  // console.log("销毁activeEffect")
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
    // console.log("添加activeEffect：", activeEffect)
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
      Reflect.set(target, key, value, receiver)
      if (oldValue !== value) {
        trigger(target, key)
      }
    }
  }
  return new Proxy(target, handler)
}

const product = reactive({ price: 5, quantity: 2, a: 1 })
let salePrice = 0
let total = 0

effect(() => {
  console.log("更新total")
  total = product.price * product.quantity
})

effect(() => {
  console.log("更新salePrice")
  salePrice = product.price * 0.9
})

console.log(`Before update total (should be 10) = ${total} salePrice (should be 4.5) = ${salePrice}`)
product.quantity = 3
console.log(`After update total (should be 15) = ${total} salePrice (should be 4.5) = ${salePrice}`)
product.price = 10
console.log(`After update total (should be 30) = ${total} salePrice (should be 9) = ${salePrice}`)
