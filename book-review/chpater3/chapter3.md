# chapter3 (함수)

## 함수의 매개변수 기본값

### ECMAScript5의 매개변수 기본값
* 다음과 같은 방식으로 초기값을 설정해 줬다
```js
function makeRequest(url, timeout, callback) {
  timeout = timeout || 2000;
  callback = callback || function() {};
  
  // 혹은
  timeout = (typeof timeout !== 'undefined') ? timeout : 2000;
  callback = (typeof callback !== 'undefined') ? callback : function() {};
}
```

### ECMAScript6의 매개변수 기본값
* 다음과 같이 초기값을 줄 수 있다.
    * null은 유효한 값으로 간주한다.

```js
function makeRequest(url, timeout = 2000, callback = function(){}) {
    //... 
}
```

### 매개변수 기본값이 arguments 객체에 미치는 영향
* 기존 ES5에서 not-strict 모드에서 매개변수를 변경할 경우 arguments에 영향을 미쳤다.
    * strict 모드에서는 단방향으로 작동한다.

```js
function mixArgs(first, second) {
  console.log(first === arguments[0]); // true
  console.log(second === arguments[1]); // true
  first = 'c';
  second = 'd';
  console.log(first === arguments[0]); // true
  console.log(second === arguments[1]); // true
}
mixArgs('a', 'b');
```

* 하지만 ES6에서는 arguments객체와 다르게 독립적으로 동작한다.
    * strict 모드와 상관없이 동일되게 동작한다.

```js
function mixArgs(first, second = 'b') {
  console.log(first === arguments[0]); // true
  console.log(second === arguments[1]); // false
  first = 'c';
  second = 'd';
  console.log(first === arguments[0]); // false
  console.log(second === arguments[1]); // false
}
mixArgs('a');
```

### 매개변수 기본값 표현식
* 함수를 통해서도 사용할 수 있다.
    * 이 getValue()는 add를 호출할 때마다 실행된다. 

```js
function getValue() {
  return 5;
}
function add(first, second = getValue()) {
  return first + second;
}
add(1); // 6
```

### TDZ에서의 매개변수 기본값

```js
function getValue(value) {
  return value + 5;
}
function add(first, second = getValue(first)) {
  return first + second;
}
add(1); // 7
```

* 다음 코드를 실행할 경우 다음처럼 작동한다.

```js
let first = 1;
let second = getValue(first);
```

* 고로 코드가 다음과 같이 될 경우 에러가 발생할 것이다.

```js
function getValue(value) {
  return value + 5;
}
function add(first = getValue(second), second ) {
  return first + second;
}
add(undefined, 1); // error
```

* 다음 순서대로 동작한다.
    * 여기서 second는 TDZ에 위치하기 때문에 사용할 수 없다.

```js
let first = getValue(second);
let second = 1;
```

## 이름을 명시하지 않은 매개변수 다루기

### 나머지 매개변수
* `...`을 매개변수 앞에 붙여 나타낸다.

```js
function a(b, ...keys) {
  console.log(keys); // [ 2, 3, 4, 5 ]
}
a(1, 2, 3, 4, 5);
```

* 사용시 두가지 제한이 있다.
    1. 이 나머지 매개변수는 반드시 하나여야 한다. 또한 마지막 위치에만 사용할 수 있다.
    2. 객체 리터럴 setter에서 나머지 매개변수를 사용할 수 없다.
        * setter는 매개변수를 하나만 받는것이 당연하니까...

## Function 생성자의 확장된 역할
* 생성자에서도 매개변수 초기화, 나머지 매개변수를 사용할 수 있다.

## 전개 연산자(`spread operator`)
* 나머지 매개변수가 여러개의 독립적인 인자를 배열로 합쳐주는 반면 전개 연산자는 배열을 나누어 개별적인 인자로 사용할 수 있게 한다.

```js
let values = [1, 2, 3, 4, 5];
console.log(Math.max(...values)); // 5
console.log(Math.max(...values, 10)); // 10
```

## name 프로퍼티
* 익명 함수 표현식이 일반화되면서 디버깅이 까다로워 졌고 많은 경우 스택 트래이스를 읽고 해석하기 어려워졌다. 이러한 이유로 name이 추가 되었다.

```js
function getName() {
  // ... 
}
console.log(getName.name); // getName
```

* bind()를 사용하여 만든 함수는 `bound`가 앞에 붙고 Function 생성자를 사용하여 만들어진 경우 `anonymous`가 붙는다. 