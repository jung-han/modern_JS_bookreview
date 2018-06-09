# chapter6 (심벌과 심벌 프로퍼티)

ES6에서는 새로운 원시타입인 `Symbol`이 추가 되었다. 비공개 객체 프로퍼티 이름을 만들기 위해 생성되었다.

## 심벌 만들기

```js
let firstName = Symbol('first name');
let person = {};
person[firstName] = 'hanjung';
console.log(person[firstName]); // hanjung
console.log(firstName); // Symbol(first name)
console.log(typeof firstName); // symbol
```

* Symbol은 원시값이기에 new Symbol()을 호출하면 에러가 발생한다.
* Symbol의 서술 문자열은 내부적으로 [[Description]] 프로퍼티에 저장됩니다.
  * 이 프로퍼티는 명시적으로나 암묵적으로 심벌의 toString() 메서드가 실행 될 때 사용됩니다.
  * 이 접근은 주로 console.log를 통해 로그로 출력될 때 호출된다. 그 외에 직접 접근하는 것은 불가능하다.

## 심벌 사용하기

* Object.defineProperty(), Object.defineProperties(), 객체 리터럴의 이름 등에 사용할 수 있다.

```js
let firstName = Symbol('first name');
let person = {
  [firstName]: 'hanjung'
};

Object.defineProperty(person, firstName, {writable: false});
```

## 심벌 공유하기

* 유일한 식별자를 나타내는 동일한 심벌 프로퍼티를 사용해야 하는 두개의 객체 타입이 있을 때 언제든지 접근할 수 있는 전역 심벌 저장소를 ES6를 제공한다.
* Symbol을 호출하는 대신 `Symbol.for()`를 사용하면 된다. 문자 식별자 하나를 매개 변수로 받는다.
    1. Symbor.for() 메서드는 먼저 전역 심벌 저장소에서 해당 키로 존재하는 심벌이 있는지 검색한다.
    2. 심벌이 존재하면 그 심벌을 반환한다.
    3. 심벌이 존재하지 않으면 명시한 키를 사용하여 새로운 심벌을 만들고 전역 심벌 저장소에 등록한다.
* `Symbol.keyFor()`메서드를 사용하면 전역 심벌 저장소에서 심벌과 관련된 키를 검색할 수 있다.

```js
let uid = Symbol.for('uid');
let uid2 = Symbol.for('uid');
let object = {
  [uid]: '12345' 
};
let object2 = {
  [uid2]: '123456'
};
console.log(object[uid]); // 12345
console.log(uid); // Symbol(uid)
console.log(uid === uid2); // true
console.log(uid2); // Symbol(uid)
console.log(Symbol.keyFor(uid2), Symbol.keyFor(uid)); // uid uid
```

## 심벌 타입 변환

* 심벌은 다른 타입들과 논리적 동치가 성립하지 않기 때문에 수자로 변환이거나 연산이 될 수 없다.

```js
let uid = Symbol.for('hanjung');
let val = uid + ''; // error
let val2 = uid / 1; // error
```

## 심벌 프로퍼티 탐색

* `Object.getOwnPropertySymbols()`는 객체가 소유한 심벌의 배열을 반환한다.

```js
let uid = Symbol('uid'),
    uid2 = Symbol('uid2'),
    uid3 = Symbol('uid3');

let obj = {
  [uid]: '123',
  [uid2]: '1234',
  [uid3]: '12345'
};

console.log(Object.getOwnPropertySymbols(obj)); // [ Symbol(uid), Symbol(uid2), Symbol(uid3) ]
```

## 상용 심벌과 내부 연산자 노출하기

* ES6에서는 내부 전용 연산자로 여겨지던 공통 동작을 `상용 심벌(well-known symbols)`로 정했다. 상용 심벌은 Symbol의 프로퍼티로 나타난다.

### `Symbol.hasInstance`
* 객체의 상속을 확인하기 위해 instanceof에 의해 사용되는 메서드

* Symbol.hasInstance는 확인에 필요한 값 하나를 인자로 받는다. 함수의 인스턴스이면 true를 반환한다.

```js
obj instanceof Array;
//를 호출할 경우
Array[Symbol.hasInstance](obj); // 가 호출된다.
```

다음과 같이 메서드 호출과 연결 되었으므로 동작을 커스터마이징 할 수 있다.

```js
function MyObject(val) {
  this.val = val;
}

Object.defineProperty(MyObject, Symbol.hasInstance, {
  value: function(v) {
    return false;
  }
});

let obj = new MyObject();
console.log(obj instanceof MyObject); // false
```

### `Symbol.isConcatSpreadable`
* Array.prototype.concat()에 매개 변수가 전달되었을 때 컬랙션의 요소를 flatten(평평)하게 재배열 해야하는지를 가리키는 boolean값이다. 
* 이 Symbol 메서드를 이용하면 특정 객체 타입에 대해 처리하는 기본 동작을 사실상 차단하고 그 방식을 변경하기 위해 사용될 수 있다.

* 다음 예시는 Arraylike object에 isConcatSpreadable 속성을 true로 줘 concat이 작동하게 한다.

```js
let collection = {
  0: 'hello',
  1: 'world',
  length: 2,
  [Symbol.isConcatSpreadable]: true
};

let messages = ['wow'].concat(collection);
console.log(messages); // [ 'wow', 'hello', 'world' ]
```

### `Symbol.match`와 `Symbol.replace`, `Symbol.search`, `Symbol.split`
* 다음 메서드 들은 정규 표현식을 인자로 받는 메서드이다. 
* 다음 특징을 정리해서 새로운 매서드를 만들 수 있다.
  * Symbol.match는 인자를 받아 매칭되는 배열을 반환하고 매칭되지 않으면 null을 반환한다.
  * Symbol.replace는 문자열 인자와 대체할 문자열을 받고 대체된 문자열을 반환
  * Symbol.search는 매칭된 숫자 인덱스를 반환하고 매칭되지 않으면 -1을 반환
  * Symbol.split은 문자열 인자를 받아 매칭되는 문자열로 나눠진 문자열 조각들의 배열을 반환

```js
let hasLengthOf10 = {
  [Symbol.match]: function(value) {
    return value.length === 10 ? [value] : null;
  },
  [Symbol.replace]: function(value, replacement) {
    return value.length === 10 ? replacement : value;
  },
  [Symbol.search]: function(value) {
    return value.length === 10 ? 0: -1;
  },
  [Symbol.split]: function(value) {
    return value.length === 10 ? ["", ""] : [value];
  }
}

let len12 = 'hello world!',
    len10 = 'hello jung';

console.log(len12.match(hasLengthOf10)); // null
console.log(len10.match(hasLengthOf10)); // ['hello jung']

//...
```

### `Symbol.toPrimitive`
* 종종 특정 연산이 적용될 때 객체를 원시값으로 변환하려고 시도하는데 Symbol.toPrimitive 메서드를 통해 변경 값을 노출한다. Symbol.toPrimitive는 명세에서 hint로 불리는 인자와 함께 호출된다.

* 'default' 모드
  * 일반적으로 number처럼 작동 시킨다. (Date는 제외)
* 'number' 모드
  1. valueOf()를 호출하고 그 결과가 원시값이면 반환한다.
  2. 아니면 toString()을 호출하고 그 결과가 원시값이면 반환한다.
  3. 아닐경우 에러를 발생시킨다.
* 'string' 모드
  1. toString()을 호출하고 그 결과가 원시값이면 반환한다.
  2. 아닐 경우 valueOf()를 호출하고 원시값이면 반환한다.
  3. 아닐 경우 에러를 발생시킨다. 

* 위 처럼 기본 동작을 오버라이드 하여 다르게 동작 시킬 수 있다.

```js
function Temparature(degrees) {
  this.degrees = degrees;
}

Temparature.prototype[Symbol.toPrimitive] = function(hint) {
  switch(hint) {
    case 'string':
      return this.degrees + "\u00b0";
    case 'number':
      return this.degrees;
    case 'default':
      return this.degrees + ' degrees';
  }
}

let freezing = new Temparature(30);
console.log(freezing + '!'); // 30 degrees!
console.log(freezing / 2); // 15
console.log(String(freezing)); // 30°
```

### `Symbol.toStringTag`
* 객체 서술 문자열을 만들기 위해 Object.prototype.toString()에서 사용된다.
* 다른 Realm(영역), 즉 frame이 다른 경우에서 instanceof를 호출할 경우 문제가 될 때 ES6 이전에는 다음과 같이 객체에 toString()을 호출하여 비교하기 시작하였다.

```js
function isArray(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
}
```

* ES6에서는 `Object.prototype.toString.call()`이 호출 되었을 때 어떤 값이 반환되는지 정의하는 프로퍼티를 나타낸다.

```js
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
```

### `Symbol.unscopables`
* with문에 포함되어선 안되는 객체 프로퍼티의 이름들을 프로퍼티로 가진 객체들이다.

* 기본값은 다음과 같다

```js
Array.prototype[Symbol.unscopables] = Object.assign(Object.create(null), {
  copyWithin: true,
  entries: true,
  fill: true,
  find: true,
  findIndex: true,
  keys: true,
  values: true
});
```