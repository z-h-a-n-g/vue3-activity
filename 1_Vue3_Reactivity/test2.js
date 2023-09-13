const depsMap = new Map()

let product = { price: 5, quantity: 2 }
let total = 0
const effect = () => total = product.price * product.quantity

function track (key) {
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(effect)
}

function trigger (key) {
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => {
      effect()
    })
  }
}

track("quantity")
effect()
console.log(total)
product.quantity = 12
trigger("quantity")
console.log(total)
{
  quantity: [

  ]
}