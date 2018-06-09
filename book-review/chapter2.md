# chapter2 (문자열과 정규 표현식)

## 더 나은 유니코드 지원
이전 자바스크립트는 16비트 기반의 `코드 유닛`을 기반으로 각각의 문자를 구성했다. 또한 length, charAt() 메서드 등 문자열 프로퍼티들은 16비트 기반으로 작성되었다. 하지만 유니코드의 도입으로 16비트는 충분하지 않게 되었다.


### UTF-16 코드포인트
* `코드 포인트`: 코드를 구성하는 숫자갑이다. 주로 문자를 표현하기 위해 쓰이거나 포맷팅을 위해 쓰인다.
    * EX> ASCII는 총 128 코드 포인트를 갖고있다.
* 유니코드의 경우 1개의 BMP와 16개의 plane의 조합으로 이뤄진다. 한 plane은 16비트이며 총 17 x 2^16 = 1,114,112 개를 표현할 수 있다.
* 유니코드를 length로 출력하면 길이가 2일 것이다. 고로 하나의 문자를 매칭하는 정규식은 실패할 것이다. 또한 charAt()으로 문자열을 반환할 수 없다.

### `codePointAt()`
* 문자열에서 주어진 위치의 코드 포인트를 가져오기 위해 쓰는 메서드
* 기본 다국어 평면 문자는 codePointAt()과 charCodeAt()이 같은 결과를 나타낸다. 

```js
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF;
}
```

* 다음 메서드를 통해 문자가 몇개의 포인트로 표현되는지 쉽게 알 수 있다.

### `String.fromCodePoint()`
* codePointAt()메서드와 반대로 한 문자의 코드 포인트를 알면 문자열로 반환할 수 있다.
    * ex> String.fromCodePoint(134071); // "古"

### `normalize()`
* 유니코드 정규화 형식(Unicode Normalizaton Form)을 지원합니다.
    * default는 NFC입니다.

### 정규 표현식의 u flag
* 정규식에 u flag가 있으면 코드 유닛이 아니느 문자를 처리하는 모드로 전환된다. 기존 정규식을 사용할 경우 유니코드는 두개의 코드 유닛에 표현되는 한자 들은 정규 표현식과 매칭 되지 않을 것이다. 하지만 u flag를 포함 시키면 코드 유닛 대신 `문자를 비교한다.`

#### 코드 포인트 갯수 세기

```js
function codePointLength(text) {
  var result = text.match(/[\s\S]/gu);
  return result ? result.length : 0;
}
```

* match 메서드를 이용하여 text의 공백과 공백이 아닌 문자를 검사하고 유니코드가 전체적으로 적용된 문자열을 판단한다.

#### u flag 지원 하는지 기능탐지

```js
function hasRegExpUFlag() {
  try {
      var pattern = new RegExp(".", "u");
      return true;
  } catch (ex) {
      return false;
  }
}
```

## 문자열의 다른 변경 사항

### 부분 문자열 식별을 위한 메서드
* 매개변수는 동일합니다. (탐색하는 문자열, index)
  * `includes()`: 해당 문자열이 있다면 true, 없다면 false
  * `startsWith()`: 해당 문자열이 매개변수로 시작하는지 true, false
  * `endsWith()`: 해당 문자열이 매개변수로 종료 되는지 true, false
      * endsWith는 비교를 뒤부터 시작합니다.
      * (문자열의 length - index) 지점부터 비교를 시작합니다.
  * 위치를 찾고 싶을땐 indexOf(), lastIndexOf()를 이용하자

### `repeat()`
* 원본 문자열을 명시한 횟수 만큼 반복하여 새로운 문자열을 반환한다.

```js
"x".repeat(4); // xxxx
"hello".repeat(2); // hellohello
```

## 정규 표현식의 변경사항
### 정규 표현식의 y flag
* y flag를 줄 경우 sticky 속성을 줄 수 있다.
    * sticky 속성은 문자열에서 정규 표현식의 lastIndex 프로퍼티로 명시 된 위치의 문자에서 매칭을 시작하는 검색을 말한다.
    * y flag는 exec, test 메서드의 결과에만 영향을 받는다.

```js
var text = "hello hello1 hello2"
var stickyPattern = /hello\d\s?/y;
stickyPattern.lastIndex = 1;
var stResult = stickyPattern.exec(text);
console.log(stResult[0]); // error!
```

### 정규 표현식 복사하기

```js
var re1 = /ab/i,
    re2 = new RegExp(re1), // ECMAScript5 가능
    re3 = new RegExp(re1, "g"); // ECMAScript5 불가능, ES6 가능
```

### flags 프로퍼티
* getFlags(): 해당 정규식의 정규표현식을 문자열로 변환하고 나서 마지막 / 다음에 발견하는 문자를 반환한다. 

```js
var re = /ab/g;
re.source; // 'ab'
re.flags; // g, ES6
getFlags(re); // g, ES6
```

## 템플릿 리터럴
* '나 "대신 `를 사용하여 문자열을 나타 냅니다.
* 멀티라인 문자열을 쉽게 만들어 줍니다. 하지만 개행을 한다면 공백으로 간주 될 수 있으니 주의해야 합니다.

### 치환자 만들기
* ${}로 결과 문자열 혹은 자바스크립트 코드를 작성할 수 있다.

```js
let cnt = 10,
    price = 0.25,
    message = `${count}: $${(cnt*price).toFixed(2)}`;
console.log(message); // 10: $2.50
```

### 템플릿 태그
* tag는 템플릿 리터럴 데이터와 함께 호출되는 간단한 함수이다.

```js
function tag(literals, ...substitutions) {
  // 문자열 반환
}
```


```js
let count = 10,
    price = 0.25,
    message = passthru`${count} items cost $${(count * price).toFixed(2)}.`;

function passthru(literals, ...substitutions) {
  console.log(literals); // [ '', ' items cost $', '.' ]
  console.log(substitutions); // [ 10, '2.50' ]
}
```

* 원본값 사용하기(String.raw()) 태그를 이용한다.

```js
let a = `hello\nNHNworld`,
    res = String.raw`hello\nNHNworld`;
console.log(a);
// hello
// NHNworld
console.log(res);
// hello\nNHNworld
```
