let price = 5;
let quantity = 2;
// let total = price * quantity
let total = 0
let dep = new Set()

// 这只是一个相关依赖，可能会出现很多相关的依赖  创建一个和price相关的依赖，然后把相关依赖添加到 Set集合里面，完成依赖收集
let effect = () => total = price * quantity

// 依赖收集  
const track = () => dep.add(effect)

// price更新之后执行 effect的Set集，更新所有的相关依赖
const trigger = () => dep.forEach(effect => effect())

track()
effect()

/**
 * 就price来说，可能很多价格都会依赖于price，比如订单总价格，支付金额，优惠率
 * 订单总价格  = price * 商品数量
 * 支付金额   = price * 商品数量 - 优惠金额
 * 优惠率 =  （price - 优惠金额）/ price 
 * */

console.log(total)
price = 20
trigger()
console.log(total)

// let price = 5;
// let quantity = 2;
// let total = 0
// let dep = new Set()

// let effect = () => total = price * quantity

// const track = () => dep.add(effect)

// const trigger = () => dep.forEach(effect => effect())

// track()
// effect()

// console.log(total)
// price = 20
// trigger()
// console.log(total)