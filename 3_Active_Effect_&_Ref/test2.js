// 对象访问器

let user = {
  fristName: 'Gregg',
  lastName: 'Pollack',
  get fullName () {
    return `${this.fristName} ${this.lastName}`
  },

  set fullName (value) {
    [this.fristName, this.lastName] = value.split(" ")
  }
}

console.log(`Name is ${user.fullName}`)
user.fullName = 'Adam Jahr'
console.log(`Name is ${user.fullName}`, user)