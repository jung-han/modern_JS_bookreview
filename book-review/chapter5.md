# chapter5 (구조분해를 이용한 보다 쉬운 데이터 접근)

## 구조분해는 왜 유용한가
지금까지 해왔던 방식은 이렇다.

```js
var obj = {
  a: 10,
  b: 20,
  c: 30
}
// 값 추출
var a = obj.a;
var b = obj.b;
var c = obj.c;
```

## 객체 구조분해
* 객체 구조분해 문법은 할당 연산자의 왼쪽에 객체 리터럴을 작성한다.

```js
let node = {
  type: 'Identifiler',
  value: 'hello'
};
let {type, value}; // error ! 초기자를 잊지 말자
let {type, value} = node; // 일반적인 객체 구조분해 방식
console.log(type, value); // Identifier hello
```

* 다음과 같이 변수 선언과 같이 사용하지 않을 경우 괄호가 필요하다.
  * 중괄호는 블록으로 인식하기 때문

```js
let node = {
  type: 'Identifiler',
  value: 'hello'
}, type, value;

({type, value}) = node;
```

* 함수를 호출하며 할당할 경우 다음과 같이 전달 후 할당한다

```js
let node = {
  type: 'Identifiler',
  value: 'hello'
}, type, value;
function hello(value) {
  return value === node;
}
hello({type, value} = node); // true
```

### 기본값
* 해당 프로퍼티가 객체에 존재 하지 않으면 디폴트는 `undefined`
* 매개변수 기본값처럼 초기화 할 수 있음

```js
let node = {
  type: 'Identifiler',
  value: 'hello'
};

let {type, value, hello = 'hello'} = node;
console.log(hello); // hello
```

### 다른 이름 할당하기

```js
let node = {
  type: 'Identifiler',
  value: 'hello'
};
let {type: localType, value: localValue, hello: localHello = 'hello'} = node;
console.log(localType, localValue); // Identifier hello
console.log(localHello); // hello
```

### 중첩된 객체 분해

```js
let node = {
  a: {
    b: {
      c: 10
    },
    d: 20
  }
};
let {a: {b: {c}}} = node;
let {a: {b: localB} = node; // 이름 바꾸기

console.log(c); // 10
console.log(localB); // {c: 10}
console.log(b); // Error
```

## 배열 구조분해

### 구조분해 할당

```js
let colors = ['red', 'green', 'blue', 'black'];
let [, , thirdColors] = colors;
console.log(thirdColors); // blue
```

#### 응용하기(swap)
* 값을 swap 하는 것을 쉽게 표현할 수 있다.

```js
let a = 10;
let b = 20;
[a, b] = [b, a]; // 임시 배열을 리터럴로 만들어 할당 후 a와 b에 다시 할당한다.
```

### 기본값

```js
let colors = ['red'];
let [firstColors, secondColors = 'green'] = colors;
console.log(secondColors); // green
```

### 중첩된 배열 구조분해

```js
let colors = ['red', 'green', ['blue', 'black']];
let [first, second, [third]] = colors;
console.log(third); // blue
```

### 나머지 요소

```js
let colors = ['red', 'green', 'blue', 'black'];
let [first, ...rests] = colors;
console.log(rests); // ['green', 'blue', 'black'];
```

#### 응용하기(배열 복사하기)
* 기존에는 `concat()`을 주로 사용
  * `var clone = arr.concat();`
  * 다음과 같이 인자없이 쓰면 복사본 반환

```js
let colors = ['red', 'green', 'blue', 'black'];
let [...newArr] = colors;
console.log(newArr); //['red', 'green', 'blue', 'black']
```

## 혼합된 구조분해

```js
let node = {
  type: 'iden',
  name: 'foo',
  loc: {
    start: {
      line: 10,
      column: 1
    },
    end: {
      line: 20,
      column: 2
    }
  }
};
```


## 구조분해 된 매개변수
함수에 매개변수를 경우 매우 유용하게 쓰일 수 있다.

```js
function setCookie(name, value, {
  secure=false,
  path='/',
  domain='example.com',
  expires=new Date(Date.now() + 360000000)
} = {}) {
  //...
}
```

다음과 같이 쓸 경우 선언을 조금 복잡하게 만들지만 인자가 사용할 수 있는 값을 갖도록 보장하기 위한 작은 비용에 불가하다.