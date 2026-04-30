# 객체와 배열 실전 기본

객체와 배열은 JavaScript에서 데이터를 담는 가장 중요한 구조다. 1부에서 자료형을 배웠다면, 여기서는 실제 코드에서 객체와 배열을 어떻게 읽고, 바꾸고, 순회하는지 정리한다.



## 객체 다루기

객체는 이름 붙은 값을 묶는 가장 기본적인 자료구조다. 프로퍼티를 읽고, 설정하고, 삭제하고, 존재 여부를 확인하고, 순회하는 방법을 익혀야 한다.

## 이 글의 위치

객체는 자바스크립트 데이터의 기본 단위다. API 응답, 설정값, 사용자 정보, 컴포넌트 props 대부분이 객체로 표현된다.

## 먼저 잡을 핵심

- 점 표기법은 정적인 프로퍼티에 적합하다.
- 대괄호 표기법은 프로퍼티 이름이 변수일 때 필요하다.
- `Object.entries()`는 키와 값을 함께 순회할 때 편하다.

## 실무 감각으로 보는 예제

객체를 순회할 때는 `for...in`보다 `Object.keys()`, `Object.values()`, `Object.entries()`가 의도를 더 분명히 보여주는 경우가 많다.

```js
const user = { name: 'Kim', age: 30, role: 'admin' };

for (const [key, value] of Object.entries(user)) {
  console.log(`${key}=${value}`);
}
```

실행 결과:

```text
name=Kim
age=30
role=admin
```

## 객체 만들기와 값 읽기

```js
const user = {
  name: 'Kim',
  age: 30,
};

console.log(user.name);
console.log(user['age']);
```

실행 결과:

```text
Kim
30
```

## 값 추가와 삭제

```js
const user = { name: 'Kim' };
user.job = 'developer';
console.log(user.job);

delete user.name;
console.log(user.name);
```

실행 결과:

```text
developer
undefined
```

## 프로퍼티 테스트

```js
const user = { name: 'Kim' };

console.log('name' in user);
console.log(user.hasOwnProperty('age'));
```

실행 결과:

```text
true
false
```

## 프로퍼티 열거

```js
const user = { name: 'Kim', age: 30 };

for (const key in user) {
  console.log(key, user[key]);
}
```

실행 결과:

```text
name Kim
age 30
```

## 자주 헷갈리는 부분

- 기본 예제는 문법을 보여주기 위한 것이고, 실무 코드는 데이터 이름과 흐름이 더 중요하다.
- 같은 문법이라도 원본 값을 바꾸는지, 새 값을 만드는지 확인해야 한다.
- 짧게 쓰는 것보다 다음 사람이 읽고 바로 이해하는 코드가 더 좋다.

## 정리

객체를 다룰 때는 점 표기법과 대괄호 표기법을 상황에 맞게 선택한다.

## 객체 복사와 JSON

객체를 복사하거나 병합할 때는 스프레드 문법을 자주 사용한다. 서버와 데이터를 주고받거나 저장할 때는 JSON 직렬화와 분석을 사용한다.

## 이 글의 위치

객체 복사와 JSON 변환은 상태 관리, API 통신, localStorage 저장에서 자주 등장한다. 특히 얕은 복사와 깊은 복사의 차이를 모르면 원본 데이터가 의도치 않게 바뀔 수 있다.

## 먼저 잡을 핵심

- 스프레드 문법은 얕은 복사다.
- 중첩 객체는 필요한 깊이까지 따로 복사해야 한다.
- JSON은 함수나 `undefined` 같은 값을 보존하지 못한다.

## 실무 감각으로 보는 예제

React 상태 업데이트처럼 원본을 직접 바꾸면 안 되는 상황에서는 중첩 객체까지 새로 만드는 습관이 중요하다.

```js
const post = {
  title: 'Hello',
  meta: { views: 10 },
};

const updated = {
  ...post,
  meta: { ...post.meta, views: post.meta.views + 1 },
};

console.log(post.meta.views);
console.log(updated.meta.views);
```

실행 결과:

```text
10
11
```

## 객체 병합

```js
const base = { name: 'Kim' };
const extra = { age: 30 };
const user = { ...base, ...extra };

console.log(user);
```

실행 결과:

```text
{name: 'Kim', age: 30}
```

## 얕은 복사 주의

```js
const user = { profile: { city: 'Seoul' } };
const copied = { ...user };

copied.profile.city = 'Busan';

console.log(user.profile.city);
console.log(copied.profile.city);
```

실행 결과:

```text
Busan
Busan
```

## JSON 변환

```js
const user = { name: 'Kim', age: 30 };
const json = JSON.stringify(user);
const parsed = JSON.parse(json);

console.log(json);
console.log(parsed.name);
```

실행 결과:

```text
{"name":"Kim","age":30}
Kim
```

## 자주 헷갈리는 부분

- 기본 예제는 문법을 보여주기 위한 것이고, 실무 코드는 데이터 이름과 흐름이 더 중요하다.
- 같은 문법이라도 원본 값을 바꾸는지, 새 값을 만드는지 확인해야 한다.
- 짧게 쓰는 것보다 다음 사람이 읽고 바로 이해하는 코드가 더 좋다.

## 정리

스프레드 문법은 얕은 복사다. 중첩 객체까지 분리하려면 `structuredClone()` 같은 방법을 고려한다.

## 배열 다루기

배열은 순서가 있는 값의 목록이다. 인덱스로 값을 읽고 쓰며, 길이와 순회 방식을 함께 이해해야 한다.

## 이 글의 위치

배열은 목록 데이터를 다루는 기본 도구다. 게시글 목록, 상품 목록, 메뉴, 댓글처럼 순서가 있는 데이터는 대부분 배열로 표현된다.

## 먼저 잡을 핵심

- 배열 인덱스는 0부터 시작한다.
- `push`, `pop`, `shift`, `unshift`는 원본 배열을 바꾼다.
- 인덱스가 필요 없으면 `for...of`가 단순하다.

## 실무 감각으로 보는 예제

`entries()`를 사용하면 배열의 인덱스와 값을 함께 다룰 수 있다. 목록 번호를 출력할 때 유용하다.

```js
const posts = ['intro', 'syntax', 'objects'];

for (const [index, slug] of posts.entries()) {
  console.log(`${index + 1}. ${slug}`);
}
```

실행 결과:

```text
1. intro
2. syntax
3. objects
```

## 배열 읽기와 쓰기

```js
const fruits = ['apple', 'banana'];
fruits[1] = 'orange';

console.log(fruits[0]);
console.log(fruits[1]);
```

실행 결과:

```text
apple
orange
```

## 배열 길이

```js
const numbers = [1, 2, 3];

console.log(numbers.length);
```

실행 결과:

```text
3
```

## 요소 추가와 삭제

```js
const numbers = [1, 2];
numbers.push(3);
console.log(numbers);

numbers.pop();
console.log(numbers);
```

실행 결과:

```text
[1, 2, 3]
[1, 2]
```

## 배열 순회

```js
const colors = ['red', 'green', 'blue'];

for (const color of colors) {
  console.log(color);
}
```

실행 결과:

```text
red
green
blue
```

## 자주 헷갈리는 부분

- 기본 예제는 문법을 보여주기 위한 것이고, 실무 코드는 데이터 이름과 흐름이 더 중요하다.
- 같은 문법이라도 원본 값을 바꾸는지, 새 값을 만드는지 확인해야 한다.
- 짧게 쓰는 것보다 다음 사람이 읽고 바로 이해하는 코드가 더 좋다.

## 정리

성긴 배열은 중간이 비어 있는 배열이다. 실무에서는 예측하기 어려우므로 되도록 피한다.

## 배열 메서드로 데이터 가공하기

배열 메서드는 데이터를 변환하고 걸러내고 합칠 때 강력하다. `forEach`, `map`, `filter`, `reduce`를 먼저 익히면 대부분의 데이터 가공을 표현할 수 있다.

## 이 글의 위치

배열 메서드는 데이터를 화면에 맞게 바꾸는 도구다. 실무에서는 원본 목록을 그대로 보여주기보다 필터링, 정렬, 변환을 거쳐 사용한다.

## 먼저 잡을 핵심

- `map`은 새 배열을 만든다.
- `filter`는 조건에 맞는 요소만 남긴다.
- `reduce`는 배열을 하나의 값으로 누적한다.

## 배열 메서드를 예제로 잡기

콜백을 쓰는 메서드는 **인자 순서**를 몸에 익히고, **원본을 바꾸는지·새 값을 주는지**를 구분하면 디버깅이 쉬워진다. 아래는 짧은 코드로 바로 확인할 수 있는 흐름이다.

### 콜백 인자: 현재 요소, 인덱스, 배열 — `reduce`는 누적값이 앞에 온다

`map`, `filter`, `forEach` 등은 보통 `(현재 요소, 인덱스, 배열 전체)` 순서다. `reduce`만 `(누적값, 현재 요소, 인덱스, 배열)`처럼 맨 앞에 누적 결과가 온다.

```js
const nums = [10, 20, 30];
const labeled = nums.map((el, i, arr) => `[${i}] ${el} (length ${arr.length})`);
console.log(labeled.join(' | '));

const folded = [1, 2, 3].reduce((acc, el, i) => acc + el + i, 0);
console.log(folded);
```

실행 결과:

```text
[0] 10 (length 3) | [1] 20 (length 3) | [2] 30 (length 3)
9
```

`reduce` 계산: `(0+1+0) → (1+2+1) → (4+3+2) = 9`.

콜백을 받는 메서드에 **두 번째 인자**를 넘기면, 일반 `function` 콜백 안에서 `this`로 쓸 수 있다. 다만 화살표 함수나 엄격 모드에서는 기대와 다를 수 있어, 요즘 코드는 보통 **클로저나 인자로 값을 넘기는 방식**이 더 안전하다.

### 원본을 바꾸는지, 새 배열·새 문자열인지

`push` / `pop` / `shift` / `unshift` / `splice` / `reverse` / `sort` / `fill` / `copyWithin`은 호출한 배열을 직접 바꾼다. `concat` / `slice`는 새 배열을 돌려준다.

```js
const stack = [1, 2];
console.log('push 반환값(새 length):', stack.push(3), '배열:', stack);
console.log('pop 반환값:', stack.pop(), '배열:', stack);

const base = [1, 2, 3];
console.log('concat 결과(원본 유지):', base.concat(4, 5), '원본:', base);
console.log('slice 결과:', base.slice(1, 3), '원본:', base);

const mid = [1, 2, 3, 4];
mid.splice(1, 2, 99);
console.log('splice 후:', mid);
```

실행 결과:

```text
push 반환값(새 length): 3 배열: [ 1, 2, 3 ]
pop 반환값: 3 배열: [ 1, 2 ]
concat 결과(원본 유지): [ 1, 2, 3, 4, 5 ] 원본: [ 1, 2, 3 ]
slice 결과: [ 2, 3 ] 원본: [ 1, 2, 3 ]
splice 후: [ 1, 99, 4 ]
```

### 검색: 값이 같을 때 vs 조건으로 찾을 때

같은 값(또는 `NaN`이 아닌 단순 비교)으로 위치를 찾을 때는 `indexOf` / `lastIndexOf`가 편하다. 객체나 “나이가 20 이상” 같은 조건이면 `find` / `findIndex`가 맞다.

```js
const tags = ['js', 'ts', 'js'];
console.log(tags.indexOf('js'), tags.lastIndexOf('js'));

const users = [
  { id: 1, name: 'Kim' },
  { id: 2, name: 'Lee' },
];
console.log(users.find((u) => u.id === 2));
console.log(users.findIndex((u) => u.id === 2));

const scores = [40, 55, 70];
console.log(scores.some((s) => s >= 60));
console.log(scores.every((s) => s >= 60));
```

실행 결과:

```text
0 2
{ id: 2, name: 'Lee' }
1
true
false
```

### 변환: 새 배열·하나의 값·문자열

`map` / `filter`는 새 배열, `reduce`는 누적한 하나의 값, `join`은 문자열을 반환한다. 원본 배열은 그대로 둔다(단, 콜백 안에서 원본 요소를 직접 고치면 예외적으로 달라질 수 있다).

```js
const n = [1, 2, 3, 4];
console.log(n.map((x) => x * 2));
console.log(n.filter((x) => x % 2 === 0));
console.log(n.reduce((a, x) => a + x, 0));
console.log(n.join('-'));
console.log('원본:', n);
```

실행 결과:

```text
[ 2, 4, 6, 8 ]
[ 2, 4 ]
10
1-2-3-4
원본: [ 1, 2, 3, 4 ]
```

## 실무 감각으로 보는 예제

메서드 체이닝은 데이터 흐름을 위에서 아래로 보여준다. 다만 너무 길어지면 중간 결과를 변수로 분리하자.

```js
const products = [
  { name: 'A', price: 10000, soldOut: false },
  { name: 'B', price: 20000, soldOut: true },
  { name: 'C', price: 30000, soldOut: false },
];

const names = products
  .filter((product) => !product.soldOut)
  .map((product) => product.name);

console.log(names.join(', '));
```

실행 결과:

```text
A, C
```

## forEach

```js
const numbers = [1, 2, 3];

numbers.forEach((number) => {
  console.log(number);
});
```

실행 결과:

```text
1
2
3
```

## map과 filter

```js
const numbers = [1, 2, 3, 4];
const result = numbers
  .filter((number) => number % 2 === 0)
  .map((number) => number * 10);

console.log(result);
```

실행 결과:

```text
[20, 40]
```

## reduce

```js
const numbers = [1, 2, 3, 4];
const total = numbers.reduce((sum, number) => sum + number, 0);

console.log(total);
```

실행 결과:

```text
10
```

## 문자열과 배열처럼 다루기

```js
const text = 'JS';

console.log(text[0]);
console.log([...text]);
```

실행 결과:

```text
J
['J', 'S']
```

## 자주 헷갈리는 부분

- 기본 예제는 문법을 보여주기 위한 것이고, 실무 코드는 데이터 이름과 흐름이 더 중요하다.
- 같은 문법이라도 원본 값을 바꾸는지, 새 값을 만드는지 확인해야 한다.
- 짧게 쓰는 것보다 다음 사람이 읽고 바로 이해하는 코드가 더 좋다.

## 정리

배열 비슷한 객체와 문자열은 배열 메서드를 바로 쓰지 못하는 경우가 있으므로 실제 배열인지 확인하는 습관이 좋다.

## 마무리

객체는 이름 붙은 값을 담고, 배열은 순서 있는 값을 담는다. 실제 JavaScript 코드는 이 둘을 조합해서 데이터를 표현하는 경우가 대부분이다. 원본을 바꾸는 코드와 새 값을 만드는 코드를 구분하면서 읽는 습관을 들이자.
