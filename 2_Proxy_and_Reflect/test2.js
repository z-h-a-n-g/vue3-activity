function reactive (target) {
  const handler = {
    get (target, key, receiver) {
      console.log(`Get was called with key = ${key}`)
      return Reflect.get(target, key, receiver)
    },
    set (target, key, value, receiver) {
      console.log("Set was calle with key = " + key + " and value = " + value)
      return Reflect.set(target, key, value, receiver)
    }
  }
  return new Proxy(target, handler)
}

let product = reactive({ price: 5, quantity: 2 })

product.quantity = 4
console.log(product.quantity)