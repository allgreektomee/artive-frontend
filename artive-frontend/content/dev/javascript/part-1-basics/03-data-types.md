# 자료형: 원시 타입과 참조 타입

JavaScript에서 값은 여러 종류로 나뉜다. 문자열, 숫자, 참과 거짓, 객체, 배열처럼 값의 형태가 다르기 때문이다.

이런 값의 종류를 자료형이라고 한다.

## JavaScript의 자료형

JavaScript의 자료형은 크게 원시 타입과 참조 타입으로 나눌 수 있다.

원시 타입은 값 자체를 다루는 타입이고, 참조 타입은 값이 저장된 위치를 참조하는 타입이다.

## 원시 타입

원시 타입에는 대표적으로 다음 값들이 있다.

- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `symbol`
- `bigint`

처음 공부할 때는 `string`, `number`, `boolean`, `null`, `undefined`를 먼저 익히면 충분하다.

## `string`

`string`은 문자열을 표현하는 타입이다.

```js
const name = "JavaScript";
const message = "Hello";

console.log(name);
console.log(message);
```

실행 결과:

```text
JavaScript
Hello
```

문자열은 작은따옴표, 큰따옴표, 백틱으로 만들 수 있다.

```js
const language = "JavaScript";
const text = `I am learning ${language}`;

console.log(text);
```

실행 결과:

```text
I am learning JavaScript
```

백틱을 사용하면 문자열 안에 변수를 쉽게 넣을 수 있다.

## `number`

`number`는 숫자를 표현하는 타입이다.

```js
const age = 20;
const price = 12000;
const rate = 3.14;
```

JavaScript에서는 정수와 실수를 모두 `number` 타입으로 다룬다.

```js
console.log(10 + 5);
console.log(10 / 3);
```

실행 결과:

```text
15
3.3333333333333335
```

## `boolean`

`boolean`은 참과 거짓을 표현한다.

```js
const isLoggedIn = true;
const isAdmin = false;
```

조건문에서 자주 사용된다.

```js
if (isLoggedIn) {
  console.log("로그인 상태입니다.");
}
```

실행 결과:

```text
로그인 상태입니다.
```

## `null`과 `undefined`

`undefined`는 값이 아직 할당되지 않았다는 의미다.

```js
let name;

console.log(name);
```

실행 결과:

```text
undefined
```

`null`은 의도적으로 비어 있는 값을 넣을 때 사용한다.

```js
const selectedUser = null;
```

둘 다 "값이 없다"는 느낌이 있지만, `undefined`는 아직 정해지지 않은 값에 가깝고 `null`은 개발자가 비어 있음을 명시한 값에 가깝다.

## 참조 타입

참조 타입에는 객체, 배열, 함수가 있다.

```js
const user = {
  name: "Kim",
  age: 30,
};

const numbers = [1, 2, 3];

function greet() {
  console.log("hello");
}

greet();
```

실행 결과:

```text
hello
```

객체와 배열은 여러 값을 묶어서 다룰 때 사용한다.

## 배열

배열은 여러 값을 순서대로 저장하는 자료구조다.

```js
const fruits = ["apple", "banana", "orange"];

console.log(fruits[0]);
console.log(fruits[1]);
console.log(fruits.length);
```

실행 결과:

```text
apple
banana
3
```

배열의 인덱스는 0부터 시작한다. 그래서 첫 번째 값은 `fruits[0]`으로 접근한다.

배열에는 서로 다른 타입의 값도 넣을 수 있다.

```js
const values = ["Kim", 20, true, null];

console.log(values);
```

실행 결과:

```text
['Kim', 20, true, null]
```

하지만 실무에서는 한 배열 안에 같은 성격의 값을 넣는 경우가 많다.

```js
const users = [
  { name: "Kim", age: 20 },
  { name: "Lee", age: 30 },
];

console.log(users[0].name);
console.log(users[1].age);
```

실행 결과:

```text
Kim
30
```

배열도 참조 타입이다. `typeof`로 확인하면 `"object"`가 나온다.

```js
const numbers = [1, 2, 3];

console.log(typeof numbers);
console.log(Array.isArray(numbers));
```

실행 결과:

```text
object
true
```

그래서 배열인지 정확히 확인할 때는 `typeof`가 아니라 `Array.isArray()`를 사용한다.

## 원시 타입과 참조 타입의 차이

원시 타입은 값 자체가 복사된다.

```js
let a = 10;
let b = a;

b = 20;

console.log(a);
console.log(b);
```

실행 결과:

```text
10
20
```

`b`를 바꿔도 `a`는 그대로다.

참조 타입은 같은 객체를 바라볼 수 있다.

```js
const user1 = {
  name: "Kim",
};

const user2 = user1;

user2.name = "Lee";

console.log(user1.name);
console.log(user2.name);
```

실행 결과:

```text
Lee
Lee
```

`user1`과 `user2`가 같은 객체를 참조하기 때문에 한쪽에서 변경하면 다른 쪽에서도 변경된 것처럼 보인다.

## 타입 확인하기

자료형은 `typeof` 연산자로 확인할 수 있다.

```js
console.log(typeof "hello");
console.log(typeof 123);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof {});
console.log(typeof []);
console.log(typeof null);
```

실행 결과:

```text
string
number
boolean
undefined
object
object
object
```

단, `typeof null`의 결과는 `"object"`다. 이것은 JavaScript의 오래된 특징으로, 실제로 `null`이 객체라는 뜻은 아니다.

## 심화: 자료형을 더 정확히 이해하기

자료형은 단순히 값의 종류를 구분하는 것에서 끝나지 않는다. JavaScript에서는 자동 형 변환, 참조 방식, 배열 판별처럼 헷갈리기 쉬운 부분이 많다.

## 원시 타입은 변경할 수 없다

원시 타입 값은 한 번 만들어지면 그 값 자체를 바꿀 수 없다.

```js
let name = "Kim";

name.toUpperCase();

console.log(name);
```

실행 결과:

```text
Kim
```

`toUpperCase()`는 기존 문자열을 직접 바꾸는 것이 아니라 새로운 문자열을 만든다.

```js
let name = "Kim";
const upperName = name.toUpperCase();

console.log(name);
console.log(upperName);
```

실행 결과:

```text
Kim
KIM
```

문자열, 숫자, 불리언 같은 원시 타입은 값 자체가 바뀌는 것이 아니라 새 값으로 교체된다고 이해하면 된다.

## 참조 타입은 같은 값을 함께 바라볼 수 있다

객체와 배열은 변수에 값 전체가 직접 들어간다기보다, 값이 있는 위치를 참조한다고 이해하면 쉽다.

```js
const original = [1, 2, 3];
const copied = original;

copied.push(4);

console.log(original);
console.log(copied);
```

실행 결과:

```text
[1, 2, 3, 4]
[1, 2, 3, 4]
```

`original`과 `copied`가 같은 배열을 바라보고 있기 때문에 한쪽에서 변경하면 다른 쪽에서도 변경된 것처럼 보인다.

배열을 새로 복사하고 싶다면 스프레드 문법을 사용할 수 있다.

```js
const original = [1, 2, 3];
const copied = [...original];

copied.push(4);

console.log(original);
console.log(copied);
```

실행 결과:

```text
[1, 2, 3]
[1, 2, 3, 4]
```

이제 `original`과 `copied`는 서로 다른 배열이다.

## 얕은 복사 주의하기

스프레드 문법은 배열이나 객체를 간단히 복사할 때 유용하다. 하지만 중첩된 객체까지 완전히 새로 복사해주지는 않는다.

```js
const users = [
  { name: "Kim" },
  { name: "Lee" },
];

const copiedUsers = [...users];

copiedUsers[0].name = "Park";

console.log(users[0].name);
console.log(copiedUsers[0].name);
```

실행 결과:

```text
Park
Park
```

배열 자체는 복사되었지만, 배열 안에 들어 있는 객체는 같은 객체를 참조하고 있기 때문이다. 이런 복사를 얕은 복사라고 한다.

## 깊은 복사하기

깊은 복사는 중첩된 객체까지 새로 복사하는 방식이다. 객체 안에 객체가 있거나, 배열 안에 객체가 있을 때 원본과 복사본을 완전히 분리하고 싶다면 깊은 복사가 필요하다.

요즘 브라우저에서는 `structuredClone()`을 사용할 수 있다.

```js
const user = {
  name: "Kim",
  address: {
    city: "Seoul",
  },
};

const copiedUser = structuredClone(user);

copiedUser.address.city = "Busan";

console.log(user.address.city);
console.log(copiedUser.address.city);
```

실행 결과:

```text
Seoul
Busan
```

`copiedUser.address.city`를 바꿨지만 원본인 `user.address.city`는 그대로다. 중첩 객체까지 새로 복사되었기 때문이다.

반대로 스프레드 문법은 얕은 복사이기 때문에 중첩 객체는 여전히 공유된다.

```js
const user = {
  name: "Kim",
  address: {
    city: "Seoul",
  },
};

const copiedUser = { ...user };

copiedUser.address.city = "Busan";

console.log(user.address.city);
console.log(copiedUser.address.city);
```

실행 결과:

```text
Busan
Busan
```

객체의 첫 번째 깊이만 복사되고, `address` 객체는 원본과 복사본이 같은 객체를 바라보고 있기 때문이다.

예전에는 JSON 방식으로 깊은 복사를 하는 코드도 많이 사용했다.

```js
const user = {
  name: "Kim",
  address: {
    city: "Seoul",
  },
};

const copiedUser = JSON.parse(JSON.stringify(user));

copiedUser.address.city = "Busan";

console.log(user.address.city);
console.log(copiedUser.address.city);
```

실행 결과:

```text
Seoul
Busan
```

하지만 JSON 방식은 단순한 객체와 배열을 복사할 때만 조심해서 사용하는 것이 좋다. `undefined`, 함수, `Date`, `Map`, `Set` 같은 값은 제대로 보존되지 않을 수 있다.

```js
const user = {
  name: "Kim",
  age: undefined,
  greet() {
    console.log("hello");
  },
};

const copiedUser = JSON.parse(JSON.stringify(user));

console.log(copiedUser);
```

실행 결과:

```text
{name: 'Kim'}
```

`undefined` 값과 함수는 JSON으로 변환하는 과정에서 사라진다.

정리하면 단순한 얕은 복사는 스프레드 문법을 사용하고, 중첩된 구조까지 분리해야 한다면 `structuredClone()`을 우선 고려하면 된다.

## `typeof`의 한계

`typeof`는 간단한 타입 확인에는 유용하지만 모든 타입을 정확히 구분하지는 못한다.

```js
console.log(typeof "hello");
console.log(typeof 123);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof null);
console.log(typeof []);
console.log(typeof {});
console.log(typeof function () {});
```

실행 결과:

```text
string
number
boolean
undefined
object
object
object
function
```

배열, 객체, `null`이 모두 `"object"`로 나오기 때문에 세밀한 구분이 필요할 때는 다른 방법을 함께 사용해야 한다.

```js
const numbers = [1, 2, 3];
const user = { name: "Kim" };
const emptyValue = null;

console.log(Array.isArray(numbers));
console.log(Array.isArray(user));
console.log(emptyValue === null);
```

실행 결과:

```text
true
false
true
```

배열은 `Array.isArray()`, `null`은 `값 === null` 방식으로 확인하는 것이 명확하다.

## `NaN`도 number 타입이다

`NaN`은 Not a Number의 약자지만, JavaScript에서는 `number` 타입이다.

```js
const result = Number("hello");

console.log(result);
console.log(typeof result);
console.log(Number.isNaN(result));
```

실행 결과:

```text
NaN
number
true
```

숫자로 변환할 수 없는 값을 숫자로 바꾸려고 하면 `NaN`이 나올 수 있다. `NaN`인지 확인할 때는 `Number.isNaN()`을 사용하면 된다.

## Truthy와 Falsy

JavaScript에서는 조건문에서 값이 자동으로 참 또는 거짓처럼 평가된다.

```js
if ("hello") {
  console.log("실행됩니다.");
}

if ("") {
  console.log("실행되지 않습니다.");
}
```

실행 결과:

```text
실행됩니다.
```

거짓처럼 평가되는 값을 Falsy 값이라고 한다.

- `false`
- `0`
- `""`
- `null`
- `undefined`
- `NaN`

나머지 대부분의 값은 Truthy 값으로 평가된다.

```js
console.log(Boolean("hello"));
console.log(Boolean(""));
console.log(Boolean(0));
console.log(Boolean([]));
console.log(Boolean({}));
```

실행 결과:

```text
true
false
false
true
true
```

빈 배열과 빈 객체는 값이 비어 있어 보여도 Truthy 값이다.

## 정리

JavaScript의 자료형은 크게 원시 타입과 참조 타입으로 나눌 수 있다. 원시 타입은 값 자체를 다루고, 참조 타입은 객체처럼 여러 값을 묶어 다룰 때 사용한다.

배열은 참조 타입이며 `typeof` 결과가 `"object"`로 나오기 때문에, 배열인지 확인할 때는 `Array.isArray()`를 사용하는 것이 좋다.

다음 글에서는 연산자와 조건문을 이용해 코드의 흐름을 제어하는 방법을 정리한다.
