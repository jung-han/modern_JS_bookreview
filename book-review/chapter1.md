# chapter 1 (블록 바인딩)

## var 선언과 호이스팅

```js
// 이 코드는 사실
function getValue(condition) {
  if(condition) {
    var a = 10;
    return a;
  }
  return 0;
}
// 이런식으로 돌아간다. 이런 동작 방식을 '호이스팅'이라 한다.
function getValue(condition) {
  var a;
  if(condition) {
    a = 10;
    return a;
  }
  return 0;
}
```

이러한 동작 방식은 처음 자바스크립트를 개발하는 사람들에게 혼란을 일으켰으며 버그를 만드는 이유가 되었다. ES6에서 그런 부분들을 해결하기 위해 블록-레벨 선언이 등장하였다.

## 블록 - 레벨 선언

### `let`
1. 재정의 금지
    * if문 예시처럼은 사용이 가능하다. 서로의 condition에 접근을 금지한다.

```js
let val = 10;
let val = 20; // error

let condition = 10;
if(condition) {
        let condition = 20;
        console.log(condition); // 20
}
console.log(condition); // 10
```

### `const`
* const를 사용한 바인딩은 상수로 간주하며 `초기화를 하지 않을 경우 에러`가 발생한다. 그리고 선언이 이미 된 값을 재정의 할 경우 에러가 발생한다.
* 또한 이미 그 스코프에서 var혹은 let으로 선언이 된 변수를 const로 다시 선언할 경우 에러가 발생한다.

```js
const val = 10;
const val2; // error
val = 20; // error
```


### TDZ(Temporal Dead Zone)
* TDZ는 ES6의 정식 스펙으로 명시되지 않았지만 let, const 변수를 선언전에 왜 접근할 수 없는지 설명하는 좋은 방법입니다.
* 코드를 해석할때 자바스크립트 엔진은 
    1. 다음 블록을 조사하고 그 블록에서 변수 선언을 찾습니다.
        * var일 경우 전역 스코프나 함수 최상단으로 호이스팅
        * let, const일 경우 TDZ에 배치하게 됩니다.
    2. 이때 TDZ안의 변수에 접근할 경우 런타임 에러가 발생합니다.
    3. 변수 선언이 이후에 실행된 후 TDZ에서 해당 변수는 제거되고 안전하게 사용할 수 있게 됩니다.
* 선언된 변수가 있는 블록 바깥에서는 에러없이 사용할 수 있지만 원하는 결과를 얻을 수 없을 수 있다.

```js
// a는 TDZ에 들어가 있는 상태이므로
var con = 10;
if(con){
        console.log(typeof a); // a is not defined
        let a = 10;
}

// 이 경우 undefined, 해당 블록에 a가 없으니
var vv = 10;
console.log(typeof a); // undefined
if(vv){
        let a = 10;
}
```

## 반복문 안에서의 블록 바인딩

### let
* 다음 예시는 for, for-in, for-of에서 모두 적용되는 예시입니다.
* 클로저를 설명할 때 가장 많이나오는 예제를 보자

```js
var funcs = [];
for(var i = 0; i < 10; i += 1) {
  funcs.push(function() {
    return i;
  });
}
funcs.forEach(function(func){
  func(); // 10, 열번 출력 
});
```

* 이 경우 각 함수는 전역에 선언되어있는 i를 참조하게 되어 i의 마지막 값인 10을 열번 출력하게 된다. 이 경우를 해결하기 위해 IIFE나 closure방법을 사용하여 해결한다.
* 하지만 이 i 선언을 let으로 바꾸게 되면 다음과 같이 쉽게 원하는 결과를 얻을 수 있다.

```js
for(let i = 0; i < 10; i += 1) {
  funcs.push(function() {
    return i;
  });
}
funcs.forEach(function(func){
  func(); // 0, 1, 2, 3, 4, ..., 9
});
```

* let으로 선언시 각 반복 실행 시에 새 변수를 만들고 그것을 이전 반복에서 같은 이름의 변수값으로 초기화 합니다. `반복문 안에서 만들어진 함수는 i의 복사본을 얻을 수 있습니다. i의 복사본은 그것이 만들어지는 반복 실행의 처음에 할당된 값을 가집니다.`

### const
* for, for-in, for-of 에서 다르게 동작합니다.
* for문의 경우 변수로 사용시 명시적으로 막지 않지만 한번 수행후 에러가 발생하게 됩니다.
* 하지만 for-in, for-of의 경우 let처럼 동작하게 되는데 한가지 다른 점은 루프 내부에서 키값을 변경할 수 없는 것입니다.

## 전역 블록 바인딩
* let, const는 var와 다르게 전역 선언시 `전역객체(window, global 처럼..)에 바인딩 되지 않습니다.` 전역 스코프를 좀 더 안전하게 사용할 수 있게 됩니다.

```js
// 브라우저 내에서
let val = 10;
console.log(val); // 10
console.log(val in window); // false
```

## 모범사례
* ES6를 사용할 경우 var의 사용을 const로 하는 것을 기본으로 하고 값을 변경할 경우에만 let으로!