# chapter8 이터레이터와 제너레이터

## 이터레이터란?
기존의 반복문은 직관적이지만 중첩해서 사용하고 여러개의 변수를 유지할 필요가 있을 때는 복잡도가 증가합니다. 

* 이터레이터는 반복을 위해 설계된 특별한 인터페이스를 가진 객체입니다.
  * 이터레이터 객체는 `next()` 메서드를 갖고 있으며 연산의 결과로 객체를 반환합니다.
  * 객체는 다음 값을 의미하는 `value`와 더 반환환 값이 없을 때 true가 되는 `done`이 있습니다.
* 이터레이터를 ES5로 작성하면 다음과 비슷할 수 있다.

```js
function createIterator(items) {
  var i = 0;
  return {
    next: function() {
      var done = (i >= items.length);
      var value = !done ? items[i++] : undefined;
      return {
        done: done,
        value: value;
      }
    }
  }
}
```

## 제네레이터란?
* 이터레이터를 반환하는 함수이다. 제너레이터 함수는 function 키워드 뒤에 `*`를 붙여 표현하고 `yield`를 사용한다.
  * 각 yield 문 이후에 실행이 멈추게 되고 next()를 호출하면 다음 지점부터 실행되게 된다.

```js
function *createIter(items) {
  for (var i=0; i<items.length; i+=1) {
    yield items[i];
  }
}

const iter = createIter([1, 2, 3, 4, 5]);
console.log(iter.next()); // { value: 1, done: false }
console.log(iter.next()); // { value: 2, done: false }
console.log(iter.next()); // { value: 3, done: false }
console.log(iter.next()); // { value: 4, done: false }
console.log(iter.next()); // { value: 5, done: false }
console.log(iter.next()); // { value: undefined, done: true }
```

* yield 키워드는 제너레이터 안에서만 사용될 수 있다. 다른 곳에서 사용될 경우 에러가 발생한다. 

```js
function *createIter(items) {
  items.forEach(function(item) {
    yield item + 1; // error
  });
}
```

### 함수 표현식
* 위 제너레이터를 다음처럼 표현할 수 있다.

```js
let createIter = function *(items) {
  for (var i=0; i<items.length; i+=1) {
    yield items[i];
  }
}
```

### 제너레이트 객체 메서드

```js
var o = {
  createIter: function *(items) {
    for (var i=0; i<items.length; i+=1) {
      yield items[i];
    }
  },
  // 혹은
  *createIter(items) {
    for (var i=0; i<items.length; i+=1) {
      yield items[i];
    }
  }
}
```

## 이터러블과 for-of 문
* 이터러블은 `Symbol.iterator` 프로퍼티를 가진 객체다. 이 상용 심볼은 주어진 객체의 이터레이터를 반환하는 함수를 명시한다.
  * 이 프로퍼티를 기반으로 `for-of` 루프가 동작하게 된다.
    1. for-of가 호출되면 Symbol.iterator 메서드를 호출한다,
    2. 그리고 iterator.next()가 호출되고
    3. 반환된 객체의 value 프로퍼티를 읽어 num에 할당한다.
    4. 그리고 done이 true이면 for-of 가 종료된다.

```js
// 다음처럼 iterator인지 확인할 수 있다.
function isIterator(obj) {
  return typeof obj[Symbol.iterator] === 'function';
}
```

### 이터러블 만들기

```js
let col = {
  items: [],
  *[Symbol.iterator]() {
    for(let item of this.items) {
      yield item;
    }
  }
}
col.items.push(1);
col.items.push(2);
col.items.push(3);
for(let x of col) {
  console.log(x); // 1 2 3
}
```

## 내장 이터레이터

### 컬렉션 이터레이터
* `entries()`: [키, 값] 을 가지는 이터레이터를 반환
* `values()`: 값을 갖는 이터레이터를 반환
* `keys()`: 키를 갖는 이터레이터를 반환
* 각 컬렉션 타입에 이터레이터가 명시적으로 지정이 되지 않는다면 `배열, Set은 values(), map은 entries()이다.`

## 전개 연산자와 배열이 아닌 이터러블
* 전개 연산자는 어떤 이터러블과도 동일하게 작동합니다.(기본 이터러블 동작을 쓰기에)

## 이터레이터 고급 기능
### 이터레이터에 인자 전달하기, 에러 발생시키기

```js
function *createIter() {
  let first = yield 1;
  let second = yield first + 2;
  yield second + 3;
}

let iter = createIter();
console.log(iter.next()); // { value: 1, done: false }
console.log(iter.next(2)); // { value: 4, done: false }
console.log(iter.next(3)); // { value: 6, done: false }
console.log(iter.throw(new Error('error'))); // error throw
```

### 제너레이터 return문
* 함수 실행을 종료하기 위해 사용될 수 있으며 next()의 마지막 호출의 반환값도 명시할 수 있다.

```js
function *createIter() {
  yield 1;
  return 42;
  yield 2;
}
let iter = createIter();

console.log(iter.next()); // { value: 1, done: false }
console.log(iter.next()); // { value: 42, done: true }
console.log(iter.next()); // { value: undefined, done: true }
```

### 제너레이터 위임하기
* yield와 별표(*)를 함께 사용하여 다른 이터레이터에 동작을 위임할 수 있습니다.

```js
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
// 3, res 값 출력
console.log(iter.next()); // { value: 'a', done: false }
console.log(iter.next()); // { value: 'b', done: false }
console.log(iter.next()); // { value: undefined, done: true}
```

## 비동기 작업 수행
* [참조 링크](http://meetup.toast.com/posts/73)