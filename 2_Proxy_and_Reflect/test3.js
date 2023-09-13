const targetMap = new WeakMap()

//  依赖收集
const track = (target, key) => {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  dep.add(effect)
}

const trigger = (target, key) => {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => effect())
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

let product = reactive({ price: 5, quantity: 2 })
let total = 0
const effect = () => total = product.price * product.quantity
// const effects = () => total = product.price * product.quantity

effect()
// effects()
console.log(total)
product.quantity = 3
console.log(total)
// product = { price: 12, quantiy: 12 }
// console.log(total)
