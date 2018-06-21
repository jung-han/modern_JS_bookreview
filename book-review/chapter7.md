# chapter7 (Set과 Map)

## Set
> Set은 중복되지 않는 값의 리스트이다.

* Set 생성자는 인자로 모든 이터러블 객체를 받는다.

### Set을 만들고 요소를 추가하기
* `add()` 메서드를 이용한다.

```js
let set = new Set();
let set2 = new Set([1,2,3,4,5,5,5,5,5,5]);

set.add(5);
set.add('5');

console.log(set.size); // 2
console.log(set2.size);// 5
```

### 요소 제거하기
* `delete()` 메서드를 이용하여 하나의 값을 제거할 수 있다.
* `clear()` 메서드를 이용하면 Set의 모든 값을 제거할 수 있다.

```js
let set = new Set([1,2,3,4,5,5,5,5,5,5]);

set.delete(3);
console.log(set); // Set { 1, 2, 4, 5 }

set.clear();
console.log(set); // Set {}
```

### `forEach()`
* `set.forEach(function(value, key, ownerSet)) {...}`의 형태로 매개 변수를 받는다. 
  * 여기서 value와 key는 같은 값을 갖는데 Map, Array와 기능적인 일관성을 유지하기 위해 같은 값을 넣어준다고 한다.

```js
let set = new Set([1,2,3,4,5,5,5,5,5,5]);

set.forEach((value, key, ownerSet) => {
  console.log(value, key);
});

// 1 1
// 2 2
// 3 3
// 4 4
// 5 5
```

### Set을 배열로 변환하기
* 다음 처럼 중복이 없는 배열을 만들어 주는 함수를 만들 수 있다.

```js
function eleminateDuplication(items) {
  return [...new Set(items)];
}
console.log(eleminateDuplication([1,2,3,4,5,5,5,5,5]));// [ 1, 2, 3, 4, 5 ]
```

### Weak Set
* 기존의 set은 객체 참조를 저장하는 방식이기 때문에 Strong set으로 불리기도 합니다. 

```js
let set = new Set(),
    weakSet = new WeakSet(),
    key = {};

set.add(key);
weakSet.add(key);

console.log(set.size); // 1
console.log(weakSet.has(key)); // true

key = null; // 원본 참조 제거

console.log(set.size); // 1
console.log(weakSet.has(key)); // false
```

* 다음과 같은 예시의 경우 Set 인스턴스에 대한 참조가 존재하는 한 가비지 컬렉션이 될 수 없어 메모리에 계속 존재하게 됩니다.


#### set과의 차이점
1. WeakSet 인스턴스에서 객체가 아닌 값이 전달되면 add()는 에러를 발생
2. 이터러블이 아니므로 for-of 불가
3. keys(), values() 같이 어떤 이터레이터도 노출되지 않는다.
4. forEach() 메서드, size 프로퍼티가 없다.

## Map
> 특정 값에 연결된 키의 컬렉션이다.

### 메서드
1. set()
2. get()
3. has(key)
4. delete(key)
5. clear()

```js
let map = new Map([['k', 'v'], ['ke', 'va']]); // 리터럴로 값 추가
map.set('title', 'nhnent');

console.log(map.get('k')); // v
console.log(map.get('title')); // nhnent
console.log(map.has('title')); // true
console.log(map.has('hello')); // false

map.delete('title');
console.log(map.has('title')); // false

map.clear();
console.log(map.size); // 0
```

### forEach() 사용하기
* `map.forEach(function(value, key, ownerMap)) {...}`의 형태로 매개 변수를 받는다. 


```js
let map = new Map([['k', 'v'], ['ke', 'va']]); // 리터럴로 값 추가
map.set('title', 'nhnent');

map.forEach((key, value, ownerMap) => {
  console.log(key, value);
});

// v k
// va ke
// nhnent title
```

### WeakMap
* Map에 약한 참조를 저장하는 방식이다.
* `set()`, `get()`, `has()`, `delete()` 메서드를 각각 사용한다.

```js
let key = {},
    key2 = {};
let weakMap = new WeakMap([[key, 'val']]);

weakMap.set(key2, 'val2');

console.log(weakMap.has(key2)); // true
console.log(weakMap.get(key2)); // val2

weakMap.delete(key2);

console.log(weakMap.has(key2)); // false
console.log(weakMap.get(key2)); // undefined
```

* 항상 객체 키만을 사용한다면 Weak Map을 선택하는 것이 좋다.
