# chapter10 (배열의 기능 개선)

## 배열 만들기
### `Array.of()`
* new Array() 의 동작에 일관성을 주기 위해 등장

```js
let arr = Array.of(1, 2, 3, 4);
for(let x of arr) {
  console.log(x); // 1 2 3 4 
}
```

### `Array.from()` 
* 유사 배열을 배열처럼 사용하길 원할 경우 이전에는 다음 메서드를 자주 사용했다.
    * `Array.prototype.slice.call(arguments)`
* 하지만 Array.from 을 사용할 경우 유사배열을 배열로 바꿔준다.

```js
function doSomething() {
  var args = Array.from(arguments);

  // args 사용
}

// 매핑을 통해 변환하여 사용하기
function trans() {
  return Array.from(arguments, (val) => val + 1);
}
let numb = trans(1, 2, 3);
console.log(numb, numb instanceof Array); // [ 2, 3, 4 ] true

// this binding 옵션
let helper = {
  diff: 1,
  add(value) {
    return value + this.diff;
  }
};

function trans() {
  return Array.from(arguments, helper.add, helper); // this가 helper로
}

let numb = trans(1, 2, 3);
console.log(numb); // [2, 3, 4]
```

## 배열의 새로운 메서드
1. `find()`, `findIndex()`
    * 콜백함수와 콜백 함수 내 this로 사용할 값을 매개변수로 전달한다.

```js
let numb = [20, 30, 50, 70, 100];

console.log(numb.find(val => val > 34)); // 50
console.log(numb.findIndex(val => val > 34)); // 2
```

2. `fill()`
* 특정 값으로 하나 이상의 배열 요소를 채운다.
* (값, 시작 인덱스, 끝 인덱스 + 1)

```js
let numb = [20, 30, 50, 70, 100];

console.log(numb.fill(1)); // [1, 1, 1, 1, 1]
console.log(numb.fill(2, 2)); // [1, 1, 2, 2, 2]
console.log(numb.fill(3, 3, 5)); // [1, 1, 2, 3, 3]
```

3. `copyWithin()`
* 배열 요소에 할당할 값을 명시하는 대신, 배열 내의 요소 값을 복사한다. 
* (값을 채우기 시작하는 인덱스, 복사 될 값이 시작하는 인덱스) 가 매개변수로 전달된다.

```js
let numb = [20, 30, 50, 70, 100];

console.log(numb.copyWithin(2, 0)); 
// 배열 인덱스 2 부터 0에 있는 값을 복사
// [20, 30, 20, 30, 50]
```

## 타입 배열
* [참조..MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)

## 타입 배열과 일반 배열의 유사점
* length 프로퍼티
* 숫자 인덱스를 사용하여 타입 배열 요소에 직접 접근 가능
* 배열에 직접 영향이 없는 대부분의 메서드는 공유한다.
* 이터레이터
* of(), from() 메서드

## 타입 배열과 일반 배열의 차이점
* 일반 배열은 조작을 통해 크기가 늘어나거나 줄어들 수 있지만 타입 배열을 항상 같은 크기를 유지한다. 
* concat(), pop(), push(), shift(), splice(), unshift() 등 배열에 직접적으로 영향을 주는 메서드는 사용할 수 없다.
* 타입 배열은 추가적으로 set(), subarray()라는 추가 메서드를 갖는다.

