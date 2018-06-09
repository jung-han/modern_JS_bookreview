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


## 함수의 두 가지 용도를 명확히 하기
* 자바스크립트 함수는 내부에 [[Call]]과 [[Construct]]라는 두가지 전용 메서드가 있다.
* new 키워드를 이용하여 함수를 호출하는 것과 그냥 호출하는 방식이 존재
  * new를 이용하여 호출하면 this를 반환
    * [[Construct]]를 이용하여 호출한다.
  * new를 이용하지 않고 호출하면 undefined를 반환하고 전역에 추가
    * [[Call]]을 이용하여 호출한다.

### ES5
* new를 이용하여 호출했는지를 판단하는 가장 쉬운 방법은 `instanceof`이다.
  * 이전에 공부 했겠지만 instanceof 메서드는 재귀적으로 생성자를 타고타고 올라가면서 같은지 비교한다.
* 하지만 `.call()`혹은 `apply()`메서드를 이용하여 호출한다면 이런 instanceof를 통해 new를 이용해 호출했는지 아닌지 알 수 없다

```js
function Person(name) {
  if (this instanceof Person) {
    this.name = name;
  } else {
    throw new Error("error");
  }
}

var notAPerson = Person.call(this, 'hanjung'); // 정상실행
```

### ES6 `new.target` 메타 프로퍼티
* `new.target`은 [[Construct]]가 호출될 때 new 연산자의 실행 대상이 저장된다.

```js
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('error');
  }
}
var notAPerson = Person.call(this, 'hanjung'); // Error
```

## 블록 레벨 함수

* `'use strict'`모드일 경우 ES6는 블록 스코프로 작동한다.

```js
'use strict'
if (true) {
  console.log(typeof a); // 'function'
  console.log(typeof b); // b is not defined, TDZ에 b가 들어가 있을 때 실행
  function a() {
    console.log('hello');
  }
  let b = function() {
    console.log('bb');
  }
  a(); // ES5에서 ERROR, ES6에서 정상 작동
}
a(); // ES6에서도 ERROR, block scope로 작동
```

### non-strict 모드의 블록 레벨 함수
전역 최상단까지 호이스팅 한다. 

```js
if (true) {
  function a() {
    console.log('bb');
  }
}
a(); // bb 출력
```

## Arrow function

### 특징
1. Arrow function은 [[Construct]] 메서드가 존재하지 않는다
  * 고로 new 연산자로 호출할 수 없다.
  * 프로토타입이 존재하지 않는다.
2. this와 super, arguments, new.target 바인딩
  * this를 변경하여 사용할 수 없다.
3. 같은 이름의 매개변수를 사용할 수 없다.

### 문법

```js
/* 1 */
var a = function(b, c) {
  return 'hello'
}
// 같은 코드
var a = (b, c) => 'hello'

/* 2 */
var a = function(b, c) {
  var d = (b + c) / 2 ;
  return {
    b,
    c,
    d
  };
};
// 같은 코드
var a = (b, c) => {
  var d = (b + c) / 2 ;
  return {
    b,
    c,
    d
  };
}

/* 3 */
var a = function(b, c) {
  return {
    b,
    c
  };
}
// 같은 코드
var a = (b, c) => ({
  b,
  c
})
```

### IIFE

```js
let person = (function(b){
  return function() {
    console.log(b);
  }
})('hello');
// 같은 코드
let person = ((b) => {
  return function() {
    console.log(b);
  }  
})('hello');
```

### No this 바인딩
* 가장 많은 실수가 발생할 수 있는 예제를 적어보자

```js
var btn = document.getElementById('test');
let pageInit = {
  initVal: 100,
  addEvent: function () {
    btn.addEventListener('click', function(){
      console.log(this.initVal);
    });
  }
};
pageInit.addEvent();
```

* btn 클릭 하면! 100이 출력되지 않을 것이다. 여기서 가리키고 있는 this는 pageInit을 가리키고 있지 않다. btn 요소를 this로 갖고 있을 것이다. 
* 이전에 이 문제를 해결하기 위해 많이 사용하는 방식은 bind를 통해 this를 재지정 해줘 사용하는 방식을 쓴다. 

```js
let pageInit = {
  ...,
  addEvent: function () {
    btn.addEventListener('click', (function(){
      console.log(this.initVal);
    }.bind(this));
  }
};
```

* 하지만 arrow function을 사용할 경우 this가 pageInit object로 지정되어 bind를 해주지 않아도 initVal을 출력할 수 있게 된다.

```js
let pageInit = {
  ...,
  addEvent: function() {
    btn.addEventListener('click', () => {
      console.log(this.initVal);
    });
  }
}
```

* 화살표 함수는 '일회성' 함수로 설계된다.

### 화살표 함수와 배열
* sort같이 콜백함수로 해당 소팅 방식을 정의를 해줄 때 쉽게 사용할 수 있게 됨

```js
var result = arr.sort(()=>{
  return a - b;
})
```

### No arguments 바인딩
* arguments객체를 갖고 있지만 둘러싼 함수의 arguments에는 접근할 수 있다.

```js
function a() {
  return () => arguments[0];
}
var b = a(4);
console.log(b()); // 4

/* 다른 예 */
var a = () => {
  console.log(arguments); // error, arguments is not defined
  return () => arguments[0];
}
var b = a(4);
console.log(b()); // 4
```

### 화살표 함수 식별하기
* 여전히 함수로 식별된다

```js
var a = () => 1;
console.log(a instanceof Function); // true
```

## 꼬리 호출 최적화
ES6에서는 꼬리호출 시스템을 최적화 하였다.
* 꼬리호출이라 함은 함수가 다른 함수의 마지막에 호출 될 때를 말한다.
  * 다음과 같이 호출 될 경우 이전 모든 스택 프레임이 메모리에 유지되고 너무 커지면 메모리에 문제가 발생할 수 있게 된다.

```js
function a() {
  return b(); // 꼬리 호출
}
a();
```

### ES6에서의 특징
* strict모드에서 특정 꼬리 호출을 위한 호출 스택의 크기를 줄인다.
* **이 조건을 만족할 경우 새로운 스텍 프레임을 만드는 대신 현재 스텍 프레임을 지우고 재사용한다.**
  1. 꼬리 호출이 현재 스택 프레임의 변수에 접근하지 않는다.(클로저 X)
  2. 꼬리 호출을 만드는 함수가 꼬리 호출 후 다른 작업이 존재하지 않는다.
  3. 꼬리 호출의 결과가 값으로 반환된다.

다음과 같은 형태를 띄면된다!

```js
function a() {
  // 외부 함수에 접근하지 않고 
  return b(); // 결과가 값으로 반환될 때
  // 호출 후 다른 작업이 존재 하지 않고
}
```

### 꼬리 호출 최적화를 이용하는 방법

팩토리얼 코드로 최적화를 시키는 예제를 작성해보자

```js
function factorial(n) {
  if (n <= 1) {
    return 1;
  } else {
    return n * factorial(n-1); // 반환 후 곱셈을 해야 함
  }
}
```

* 다음과 같이 변경될 수 있다.
  * 다음과 같이 작성할 경우 모든 조건을 만족시켜 최적화를 시킬 수 있다.
  * 이런 방식은 재귀함수를 호출하는 로드가 매우 큰 함수에서 항상 고려해야 한다.

```js
function factorial(n, p=1) {
  if(n <= 1) {
    return p * 1;
  } else {
    let result = n * p;
    return factorial(n-1, result);
  }
} 
```
