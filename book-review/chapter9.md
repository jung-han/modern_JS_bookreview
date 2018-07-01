# chapter9 (자바스크립트 클래스 소개)

## 클래스 선언
기본적인 클래스 선언은 다음과 같다.
* `constructor`는 생성자의 역할을 합니다.
* 메서드 작성은 간결한 문법을 사용
* 여기서 생성한 클래스의 `Person.prototype`은 읽기 전용이기 떄문에 새 값을 할당하여 쓸 수 없다.

```js
class PersonClass {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}

let person = new PersonClass('hanjung');
person.sayName(); // hanjung
console.log(person instanceof PersonClass); // true
```

### 여기서 주의해야 할 점!
1. 클래스 선언은 호이스팅이 되지 않습니다. 클래스 선언은 let 선언처럼 동작하여 선언에 도달하기 전까지 TDZ에 존재합니다.
2. 클래스 내 모든 코드는 strict모드로 작동합니다.
3. 모든 메서드는 열거할 수 없습니다. 열거하게 하려면 `Object.defineProperty()`를 이용해야 합니다.
4. 모든 메서드에는 `[[Construct]]`가 없으므로 new와 함께 호출할 시 에러가 발생합니다.
5. new 없이 생성자를 호출하면 에러가 발생합니다.
6. 클래스 메서드 내에서 클래스 이름을 덮어쓰려 하면 에러가 발생합니다.

```js
// 메서드 내부에서 이름을 수정할 수 없다는 뜻 
class Foo {
  constructor() {
    Foo = "bar"; // ERROR
  }
}

Foo = 'baz'; // 선언 이후에는 문제 없음
```

## 클래스 표현식
클래스또한 선언과 표현식 두가지가 존재합니다.

```js
let PersonClass = class {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
};

let person = new PersonClass('hanjung');
person.sayName(); // hanjung
console.log(person instanceof PersonClass); // true
```

**클래스 표현식은 호이스팅이 되지 않으므로 어떤 것을 선택하든 런타임 동작과 상관이 없는 스타일의 차이이다.**

### 이름을 명시한 클래스 표현식

```js
let PersonClass = class PersonClass2{
  constructor(name) {
    this.name = name;
    console.log(PersonClass2);
  }
  sayName() {
    console.log(this.name);
  }
};
let person = new PersonClass('hanjung'); // [Function: PersonClass2], 내부에서만 쓸 수 있음
console.log(typeof PersonClass); // function
console.log(typeof PersonClass2); // undefined, 외부에서는 접근 불가
```

## 일급 시민(first-class citizen) 클래스
* `함수에 전달`이되고 `함수로 부터 반환`되고 `변수에 할당`할 수 있는 일급시민 특징을 갖는다.

```js
function classObject(classDef) {
  return new classDef();
}
let obj = classObject(class {
  sayHi() {
    console.log('hi');
  }
})

obj.sayHi(); // hi

let person = new class {
  constructor(name) {
    this.name = name;
  }
  sayName() {
    console.log(this.name);
  }
}('hanjung');
person.sayName(); // hanjung
```

## 접근자 프로퍼티
* 클래스는 프로토타입에 접근자 프로퍼티를 정의 하는 것을 허용합니다.

```js
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }
  get html() {
    return this.element;
  }
  set html(value) {
    this.element = value + 'hello';
  }
}

let obj = new CustomHTMLElement('<div></div>');
console.log(obj.html); // <div></div>
obj.html = '<div>hello</div>';
console.log(obj.html); // <div>hello</div>hello
```

접근자 프로퍼티는 다른 일반적인 메서드처럼 열거가 불가능해 집니다.

## 계산된 멤버이름

```js
let methodName = 'sayName';

class PersonClass {
  constructor(name) {
    this.name = name;
  }
  [methodName]() {
    console.log(this.name);
  }
}
let person = new PersonClass('hanjung');
person.sayName(); // hanjung
```

## 제네레이터 메서드
* Symbol.iterator를 사용함으로써 클래스의 기본 이터레이터를 사용할 수 있다.

```js
class Collection {
  constructor() {
    this.items = [];
  }
  * [Symbol.iterator]() {
    yield *this.items.values();
  }
}

var coll = new Collection();
coll.items.push(1);
coll.items.push(2);
coll.items.push(3);
for(let x of coll) {
  console.log(x); // 1 2 3 
}
```

## 정적멤버
* `static` 키워드를 사용하여 정적 멤버를 쉽게 만들 수 있다.

```js
class PersonClass {
  ...
  static create(name) {
    return new PersonClass(name);
  }
}

let person = PersonClass.create('hanjung');
```

## 파생 클래스와 상속
* 이전까지 사용자 정의 타입의 상속을 구현하기 위해서는 생성자 훔치기 등 여러가지 방법을 사용했어야만 했다.

```js
function Rectangle(length, width) {
  this.length = length;
  this.width = width;
}

Rectangle.prototype.getArea = function() {
  return this.length * this.width;
}

function Square(length) {
  Rectangle.call(this, length, length);
}

Square.prototype = Object.create(Rectangle.prototype, {
  constructor: {
    value: Square,
    enumerable: true,
    writable: true,
    configurable: true
  }
});


// 를 다음처럼 변경할 수 있다.

class Rectangle {
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }
  getArea() {
    return this.length * this.width;
  }
}

class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
  ...
}
```

* 파생 클래스에서 생성자를 명시하려면 반드시 `super()`를 사용해야하만 하고, 그렇게 하지 않으면 에러가 발생한다.

### super() 사용 시 유의할 점
1. 파생 클래스 생성자에서만 super()를 사용할 수 있다.
    - 파생 클래스가 아닌 클래스나 함수에서 사용시 에러가 난다.
2. super는 this를 초기화 하는 역할을 하기 때문에 super호출 전 this에 접근할 경우 문제가 발생한다.
    - 생성자 내의 this에 접근하기 전에 super()를 호출해야 한다.
3. super를 호출하지 않는 유일한 방법은 클래스 생성자에서 객체를 반환하는 것이다. 

### 클래스 메서드 대신하기
* 파생 클래스에서는 항상 기반 클래스의 같은 이름을 가진 메서드를 shadowing 한다. 동작을 재정의 하기 위해 메서드를 추가할 수 있다. 

```js
class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
  getArea() {
    return super.getArea(); // 상위 메서드 접근
  }
}
```

* 정적으로 선언된 메서드는 하위 클래스에서 쉽게 접근하여 사용할 수 있다.

### 표현식으로부터 파생된 클래스
* [[Construct]]와 프로토타입을 갖고 있는 함수의 어떤 표현식이든지 extends와 함께 사용할 수 있다. 

```js
// ECMAScript 5 스타일 생성자를 상속할 수 있다. 
function Rectangle() {
  ...
}
class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}

// 동적으로 상속받을 대상을 결정할 수 있다.
function getBase() {
  return Rectangle;
}
class Square extends getBase() {
  constructor(length) {
    super(length, length);
  }
}

// 다음처럼 믹스인 패턴으로 정의할 수 있다.
function mixin(...mixins) {
  var base = function() {};
  Object.assign(base.prototype, ...mixins);
  return base;
}
class Square extends mixin(Amixin, Bmixin) {
  constructor() {
    super();
    ...
  }
}
```

* extends 뒤에 null이나 제네레이터 함수를 사용하면 에러가 발생한다.
    * [[Construct]]가 없기 때문에 에러가 발생할 것이다.

### 내장된 타입의 상속
* ECMAScript6 클래스의 목표는 모든 내장 타입의 상속을 허용한다. 
    1. this 값은 파생타입에 의해 먼저 만들어지고 나서
    2. 기반 타입 생성자가 호출 된다. 

```js
class MyArray extends Array {
  ...
}
var colors = new MyArray();
colors[0] = 'red';
colors.length = 0;
console.log(colors[0]); // undefined
```

### `Symbol.species`
* Symbol.species는 함수를 반환하는 정적 접근자 프로퍼티를 정의하기 위해 사용된다.
* `Array, ArrayBuffer, Map, Promise, RegExp, Set, 타입배열`은 이 프로퍼티가 항상 생성자 함수를 반환한다는 것을 의미하고 다음처럼 사용할 수 있다.

```js
class MyClass {
  static get [Symbol.species]() {
    return this;
  }
  constructor(value) {
    this.value = value;
  }
  clone() {
    return new this.constructor[Symbol.species](this.value);
  }
}
```

* 일반적으로 클래스 메서드에서 this.constructor를 사용하려는 경우 Symbol.species 프로퍼티를 사용해야만 한다. 이는 파생 클래스의 반환 타입을 쉽게 오버라이드 할 수 있도록 한다.
    * p211 예제 참조

## 클래스 생성자에서 `new.target` 사용하기
* 클래스 생성자에서는 new.target에서 클래스의 생성자 함수와 같다. 
