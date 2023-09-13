const product = { price: 5, quantity: 2 }

const proxiedProduct = new Proxy(product, {
  get (target, key, receiver) {
    console.log("Get was called with key = " + key)
    return Reflect.get(target, key, receiver)
  },
  set (target, key, value, receiver) {
    console.log("Set was calle with key = " + key + " and value = " + value)
    return Reflect.set(target, key, value, receiver)
  }
})

// proxiedProduct.quantity = 4
console.log(proxiedProduct.quantity)