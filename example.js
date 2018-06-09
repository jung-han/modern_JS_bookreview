let uid = Symbol('uid'),
    uid2 = Symbol('uid2'),
    uid3 = Symbol('uid3');

let obj = {
  [uid]: '123',
  [uid2]: '1234',
  [uid3]: '12345'
};

console.log(Object.getOwnPropertySymbols(obj)); // [ Symbol(uid), Symbol(uid2), Symbol(uid3) ]