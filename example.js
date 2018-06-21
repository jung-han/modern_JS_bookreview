let key = {},
    key2 = {};
let weakMap = new WeakMap([[key, 'val']]);

weakMap.set(key2, 'val2');

console.log(weakMap.has(key2)); // true
console.log(weakMap.get(key2)); // val2

weakMap.delete(key2);

console.log(weakMap.has(key2)); // false
console.log(weakMap.get(key2)); // undefined
