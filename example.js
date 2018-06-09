function Person(name) {
  this.name = name;
}

Person.prototype[Symbol.toStringTag] = 'Hanjung';

Person.prototype.toString = function() {
  return this.name;
}

var me = new Person('hanjung!');

console.log(me.toString()); // hanjung!
console.log(Object.prototype.toString.call(me)); // [object Hanjung]