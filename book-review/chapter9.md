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