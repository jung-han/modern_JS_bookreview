# chapter4 (확장된 객체 기능)

## 객체 카테고리
ES6에서는 다음과 같이 객체들의 카테고리를 명확하게 나눈다.
1. 일반 객체(ordinary objects): 자바스크립트 객체의 모든 기본 내부 동작을 가진다.
2. 이형 객체(exotic objects): 기본과 다른 내부동작을 지닌다.
3. 표준 객체(standard objects): ES6에서 정의 되었으며 Array, Date등이 포함된다. 일반 객체이거나 이형객체일 수 있다.
4. 내장 객체(built-in objects): 자바스크립트 실행환경에 따라 존재하는 객체이다. 모든 표준객체는 내장객체이다.

## 객체 리터럴의 문법 확장

### property initializer(프로퍼티 초기자) 축약 문법

```js
function createPerson(name, age) {
  return {
    name: name,
    age: age
  };
}
// 를 다음과 같이 쓸 수 있게 되었다.
function createPerson(name, age) {
  return {
    name,
    age
  };
}
```

### concise methods(간결한 메서드)
객체 리터럴에서 메서드 할당을 위한 문법이 개선되었다.

```js
let a = {
  b: function() {
    return 'hello';
  }
}
// 를 다음과 같이 쓸 수 있게 되었다.
let a = {
  b() {
    return 'hello';
  }
}
```

다음과 같이 사용할 경우 익명 함수 표현식이 할당되고 간결한 메서드의 경우 `super`를 사용할 수 있게 된다.

### Computed property name
* ES6의 경우 다음과 같이 프로퍼티들을 할당할 수 있게 된다. 

```js
let lastName = 'last Name';
let person = {
  hello: 'world',
  [lastName]: 'hello'
}
console.log(person[lastName]); // hello

// 또한 다음과 같이 표현식을 포함할 수도 있다.
let suffix = ' name'
let person = {
  ['hello' + suffix]: 'world'
}
console.log(person['hello name']); // world
```

## 새로운 메서드

### `Object.is()` 메서드
* 기존 자바스크립트에서는 `==`, `===`로 값을 비교
* 하지만 여기서 애매한 점이 발생하게 되는데

```js
console.log(+0 === -0); // true
console.log(NaN === NaN); // false
```

* 아래와 같은 애매한 점이 발생하여 isNaN() 메서드를 사용하거나 해야했다.

* 하지만 Object.is()는 다르게 동작한다.
    * 대부분 `===`처럼 동작하지만 +0과 -0을 다르게 NaN과 NaN을 비교시 같다고 비교하게 된다.

```js
console.log(Object.is(+0, -0)); // false
console.log(Object.is(NaN, NaN)); // true
```

### `Object.assign()` 메서드
* Mixin패턴 사용시 주로 사용하게 된다.
* Mixin패턴은 대상이 되는 객체에 shallow copy를 하게 된다. 프로퍼티의 값이 객체면 객체의 참조값이 복사된다.
* 상속없이 새로운 프로퍼티를 추가할 수 있게 될 수 있다. 

```js
function EventTarget() {}
EventTarget.prototype = {
  constructor: EventTarget,
  getName() {
    return 'hanjung'
  },
  getAge() {
    return 27
  }
};

var obj = {};
Object.assign(obj, EventTarget.prototype);
console.log(obj.getName()); // hanjung
console.log(obj.getAge()); // 27
```

* 순차적으로 공급자의 프로퍼티를 받는다. 두번째로 들어온 공급자는 첫번째 값을 덮어쓸 수 있다.

```js
var receiver = {};
Object.assign(receiver, 
  {
    age: 27,
    name: 'hanjung'
  },
  {
    age: 1
  }
);
console.log(receiver.age); // 1
```

#### 접근자 프로퍼티 동작
* 공급자가 접근자 프로퍼티를 가질 때 Object.assign() 메서드는 수신자에 접근자 프로퍼티를 생성하지 않는다. 
* Object.assign은 할당 연산자를 사용하기 때문에 공급자의 접근자 프로퍼티는 수신자의 데이터 프로퍼티가 된다.

```js
let receiver = {},
    supplier = {
      get name() {
        return 'file.js';
      }
    };

Object.assign(receiver, supplier);
var desc = Object.getOwnPropertyDescriptor(receiver, 'name');
console.log(desc.value); // file.js
console.log(desc.get); // undefined
```

## 객체 리터럴 프로퍼티의 중복
* ES5에서 프로퍼티가 중복될 경우 에러를 발생시키지만 ES6에서는 에러를 발생시키지 않고 마지막 할당된 값을 사용한다.
    * strict, non strict모두 둘다 동일하게 동작한다.

```js
let obj = {
  a: 100,
  b: 200,
  a: 300
};
console.log(obj.a); // 300, ES5에서는 에러
```

## 객체 내 프로퍼티 열거 순서
* ES5에서 객체 프로퍼티의 열거 순서를 정의하지 않았고 벤더들에 의존하였다. 하지만 ES6에서는 프로퍼티를 열거할 때 반환하는 순서를 엄격하게 정의한다.

### 규칙
1. 모든 숫자 키는 오름차순
2. 모든 문자열 키는 추가된 순서
3. 모든 심벌키는 추가된 순서

```js
let obj = {
  1: 'hanjung',
  0: '0jung',
  2: 'doojung',
  b: 'bjung',
  a: 'ajung'
};

console.log(Object.getOwnPropertyNames(obj));
// [ '0', '1', '2', 'b', 'a' ]
```

* 엔진마다 다르게 for-in, Object.keys, JSON.stringfy 같은 경우 지정되지 않은 열거 순서를 사용한다.

## 프로토타입 개선
ES5에서 인스턴스의 프로토타입을 변경하는 것은 주요한 가정이었다. 하지만 ES6에서 이 인스턴스의 프로토타입을 변경할 수 있게 된다.

### 프로토타입 변경하기
* `Object.setPrototype()`을 통해 객체 프로토타입이 인스턴스화 된후에도 변경될 수 있게 했다.

```js
let person = {
  greeting() {
    return 'hello';
  }
};
let dog = {
  greeting() {
    return 'woof!';
  }
};

let friend = Object.create(person);
console.log(friend.greeting()); // hello

Object.setProtype(friend, dog);
console.log(friend.greeting()); // woof!
```

### Super를 통한 쉬운 프로토 타입 접근!

* `super`는 Object.getPrototypeOf()와 .call(this)를 사용하는 것처럼 작동한다.
    * 즉 super는 `현재 객체의 프로토타입을 가리키는 포인터`이며 사실상 Object.getPrototypeOf(this)이다.
* super는 간결한 메서드 안에서만 사용할 수 있으며 다른곳에서는 사용할 수 없다.

```js
let person = {
  getGreeting() {
    return 'hello';
  }
};

let friend = {
  getGreeting() {
    return Object.getPrototypeOf(this).getGreeting.call(this) + ', hi!';
  }
};
Object.setPrototypeOf(friend, person);

let relative = Object.create(friend);

console.log(person.getGreeting()); // hello
console.log(friend.getGreeting()); // hello, hi!
console.log(relative.getGreeting()); // 에러!
```

* 에러가 나는 이유는 다음과 같다.
    * this는 relative이다.
    * Object.getPrototypeOf(this)는 friend일 것이다.
    * friend의 getGreeting을 호출하는데 this는 또 relative이다.
    * 결국 또 같은 메서드를 호출한다. 재귀적으로 계속해서 호출할 것이고 스택 오버플로우 에러가 날 것이다. 

```js
...
let friend = {
  getGreeting() {
    return super.getGreeting() + ', hi!';
  }
};
...
console.log(relative.getGreeting()); // hello, hi!
```

* super 참조는 동적이지 않기 때문에 항상 올바른 객체를 참조한다.
    * 얼마나 많은 객체가 그 메서드를 참조했는지는 중요치 않다.

## 공식적인 메소드 정의
> ES6에서 '메서드'는 메서드가 속한 객체를 내부 [[HomeObject]]프로퍼티로 갖는 함수를 메서드로 칭한다. 

* 어디서든 super를 참조할 때는 [[HomeObject]]를 사용하여 동작을 결정한다.
    1. 프로토 타입을 참조하기 위해 [[HomeObject]]의 Object.getPrototypeOf()를 호출한다.
    2. 그 프로토 타입에서 같은 이름의 함수를 검색한다.
    3. this를 바인딩하고 메서드를 호출한다.

```js
let person = {
  getGreeting() {
    reutrn 'Hello';
  }
};
let friend = {
  getGreeting() {
    return super.getGreeting() + ', hi!';
  }
};
Object.setPrototype(friend, person);
console.log(friend.getGreeting()); // Hello, hi!
```
