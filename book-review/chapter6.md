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

### `Symbol.hasInstance`

### `Symbol.isConcatSpreadable`

### `Symbol.match`와 `Symbol.replace`, `Symbol.search`, `Symbol.split`

### `Symbol.toPrimitive`

### `Symbol.toStringTag`

### `Symbol.unscopables``

