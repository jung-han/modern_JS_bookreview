function *createIter() {
  yield 1;
  yield 2;
  return 3;
}
function *createIter2(result) {
  console.log(result);
  yield 'a';
  yield 'b';
}
function *createIterFactory() {
  let res = yield *createIter();
  yield *createIter2(res);
}

var iter = createIterFactory();
console.log(iter.next()); // { value: 1, done: false }
console.log(iter.next()); // { value: 2, done: false }
// 3
console.log(iter.next()); // { value: 'a', done: false }
console.log(iter.next()); // { value: 'b', done: false }
console.log(iter.next()); // { value: undefined, done: true}