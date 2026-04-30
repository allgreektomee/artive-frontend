# 변수: `var`, `let`, `const`

JavaScript에서 변수는 값을 저장하기 위한 이름표다. 프로그램을 작성하다 보면 숫자, 문자열, 객체처럼 여러 값을 다루게 되는데, 이 값을 다시 사용하기 위해 변수에 담아둔다.

JavaScript에서는 변수를 선언할 때 `var`, `let`, `const`를 사용할 수 있다.

## 변수 선언이란?

변수 선언은 "이 이름을 변수로 사용하겠다"고 JavaScript에게 알려주는 것이다.

```js
let name = "JavaScript";
const year = 2026;

console.log(name);
console.log(year);
```

실행 결과:

```text
JavaScript
2026
```

위 코드에서 `name`과 `year`는 변수 이름이고, `"JavaScript"`와 `2026`은 변수에 저장된 값이다.

## 식별자와 리터럴

변수를 이해할 때 식별자와 리터럴도 함께 알아두면 좋다.

식별자는 변수, 함수, 클래스처럼 코드 안에서 어떤 값을 구분하기 위해 붙이는 이름이다.

```js
const language = "JavaScript";

console.log(language);
```

실행 결과:

```text
JavaScript
```

위 코드에서 `language`는 식별자다. JavaScript 엔진은 이 이름을 통해 저장된 값을 찾는다.

리터럴은 코드에 직접 적은 값이다.

```js
const age = 20;
const name = "Kim";
const isStudent = true;

console.log(age);
console.log(name);
console.log(isStudent);
```

실행 결과:

```text
20
Kim
true
```

위 코드에서 `20`, `"Kim"`, `true`는 리터럴이다. 리터럴은 값 그 자체를 표현하고, 식별자는 그 값을 가리키는 이름이라고 이해하면 된다.

## `var`

`var`는 오래전부터 사용되던 변수 선언 방식이다.

```js
var message = "hello";
message = "hi";

console.log(message);
```

실행 결과:

```text
hi
```

`var`로 선언한 변수는 값을 다시 할당할 수 있다. 하지만 `var`는 스코프와 호이스팅에서 헷갈리는 동작이 많기 때문에 요즘 JavaScript에서는 자주 권장되지 않는다.

```js
if (true) {
  var count = 10;
}

console.log(count);
```

실행 결과:

```text
10
```

`var`는 블록 스코프를 따르지 않기 때문에 `if` 블록 밖에서도 `count`에 접근할 수 있다. 이런 동작은 코드가 커질수록 예상하지 못한 버그로 이어질 수 있다.

## `let`

`let`은 값을 다시 할당할 수 있는 변수를 만들 때 사용한다.

```js
let score = 80;
score = 90;

console.log(score);
```

실행 결과:

```text
90
```

`let`은 블록 스코프를 따른다.

```js
if (true) {
  let count = 10;
  console.log(count);
}

// console.log(count); // ReferenceError
```

실행 결과:

```text
10
```

블록 안에서 선언한 변수는 블록 밖에서 사용할 수 없다. 그래서 `var`보다 변수의 범위를 예측하기 쉽다.

## `const`

`const`는 한 번 값을 할당하면 다시 할당할 수 없는 변수를 만들 때 사용한다.

```js
const language = "JavaScript";

// language = "TypeScript"; // TypeError

console.log(language);
```

실행 결과:

```text
JavaScript
```

값이 바뀌면 안 되는 경우에는 `const`를 사용하는 것이 좋다.

다만 `const`가 값 자체를 완전히 불변으로 만든다는 뜻은 아니다. 객체나 배열을 `const`로 선언해도 내부 값은 바꿀 수 있다.

```js
const user = {
  name: "Kim",
};

user.name = "Lee";

console.log(user.name);
```

실행 결과:

```text
Lee
```

`user`라는 변수에 다른 객체를 다시 할당할 수는 없지만, 객체 안의 속성은 변경할 수 있다.

## 언제 무엇을 써야 할까?

요즘 JavaScript에서는 기본적으로 `const`를 먼저 사용하고, 값이 다시 바뀌어야 할 때만 `let`을 사용한다.

`var`는 기존 코드를 읽을 때 알아두면 되지만, 새로 작성하는 코드에서는 가능하면 사용하지 않는 것이 좋다.

```js
const title = "JavaScript Blog";
let viewCount = 0;

viewCount = viewCount + 1;

console.log(title);
console.log(viewCount);
```

실행 결과:

```text
JavaScript Blog
1
```

변하지 않는 값은 `const`, 변해야 하는 값은 `let`으로 구분하면 코드의 의도를 더 쉽게 이해할 수 있다.

## 심화: 변수를 더 정확히 이해하기

`var`, `let`, `const`의 차이는 단순히 "옛날 문법과 최신 문법" 정도로만 끝나지 않는다. 실제로는 스코프, 호이스팅, 재선언, 재할당 같은 개념과 연결되어 있다.

## 재선언과 재할당

재선언은 같은 이름으로 변수를 다시 선언하는 것이고, 재할당은 이미 선언된 변수에 새로운 값을 넣는 것이다.

```js
var name = "Kim";
var name = "Lee";

console.log(name);
```

실행 결과:

```text
Lee
```

`var`는 같은 이름으로 다시 선언할 수 있다. 작은 예제에서는 문제가 없어 보이지만, 코드가 길어지면 실수로 기존 변수를 덮어쓸 수 있다.

반면 `let`과 `const`는 같은 스코프 안에서 재선언할 수 없다.

```js
let age = 20;
// let age = 30; // SyntaxError

age = 30;

console.log(age);
```

실행 결과:

```text
30
```

`let`은 재선언은 불가능하지만 재할당은 가능하다.

`const`는 재선언도 재할당도 불가능하다.

```js
const language = "JavaScript";
// const language = "TypeScript"; // SyntaxError
// language = "TypeScript"; // TypeError

console.log(language);
```

실행 결과:

```text
JavaScript
```

## 일시적 사각지대, TDZ

`let`과 `const`는 선언 전에 접근하면 에러가 발생한다. 이 구간을 TDZ라고 부른다. TDZ는 Temporal Dead Zone의 약자다.

```js
// console.log(title); // ReferenceError

let title = "JavaScript";

console.log(title);
```

실행 결과:

```text
JavaScript
```

`let`과 `const`도 호이스팅은 되지만, 선언문에 도달하기 전까지는 사용할 수 없다. 그래서 선언 전에 변수를 잘못 사용하는 실수를 빠르게 발견할 수 있다.

`var`는 선언 전에 접근해도 에러가 나지 않고 `undefined`가 출력된다.

```js
console.log(title);

var title = "JavaScript";

console.log(title);
```

실행 결과:

```text
undefined
JavaScript
```

이런 동작은 편해 보일 수 있지만, 실제로는 버그를 숨기기 쉽다.

## `const`는 불변을 의미할까?

`const`는 변수에 다른 값을 다시 할당할 수 없다는 뜻이다. 값 자체가 완전히 변하지 않는다는 뜻은 아니다.

```js
const numbers = [1, 2, 3];

numbers.push(4);

console.log(numbers);
```

실행 결과:

```text
[1, 2, 3, 4]
```

배열을 `const`로 선언해도 배열 안의 값을 변경할 수 있다. 막히는 것은 `numbers`에 완전히 다른 배열을 다시 넣는 것이다.

```js
const numbers = [1, 2, 3];

// numbers = [4, 5, 6]; // TypeError

console.log(numbers);
```

실행 결과:

```text
[1, 2, 3]
```

객체도 마찬가지다.

```js
const user = {
  name: "Kim",
};

user.age = 30;

console.log(user);
```

실행 결과:

```text
{name: 'Kim', age: 30}
```

`const`를 사용하면 변수 이름이 다른 값을 가리키지 않도록 막을 수 있다. 하지만 객체 내부까지 자동으로 보호해주지는 않는다.

## 블록 스코프가 중요한 이유

`let`과 `const`가 블록 스코프를 따른다는 점은 실제 코드에서 중요하다.

```js
const isLoggedIn = true;

if (isLoggedIn) {
  const message = "환영합니다.";
  console.log(message);
}

// console.log(message); // ReferenceError
```

실행 결과:

```text
환영합니다.
```

`message`는 `if` 블록 안에서만 필요하다. 이런 변수는 블록 밖으로 새어나오지 않는 편이 좋다.

변수의 범위가 좁을수록 코드를 읽고 수정하기 쉬워진다. 그래서 필요한 위치에 가깝게 변수를 선언하는 습관이 중요하다.

## 실무에서 자주 쓰는 기준

실무에서는 보통 다음 기준으로 변수를 선언한다.

1. 일단 `const`로 선언한다.
2. 값이 바뀌어야 하면 `let`으로 바꾼다.
3. `var`는 새 코드에서 사용하지 않는다.
4. 변수는 사용하는 곳과 최대한 가까운 위치에 선언한다.
5. 변수 이름은 값의 의미가 드러나게 작성한다.

예를 들어 다음 코드보다

```js
let x = 12000;
let y = 3;
let z = x * y;

console.log(z);
```

실행 결과:

```text
36000
```

이 코드가 더 읽기 쉽다.

```js
const productPrice = 12000;
const quantity = 3;
const totalPrice = productPrice * quantity;

console.log(totalPrice);
```

실행 결과:

```text
36000
```

변수는 단순히 값을 담는 공간이 아니라, 코드의 의미를 설명하는 이름표이기도 하다.

## 정리

`var`, `let`, `const`는 모두 변수를 선언하는 방법이다. 하지만 스코프와 재할당 가능 여부가 다르다.

- `var`: 오래된 방식, 블록 스코프를 따르지 않음
- `let`: 재할당 가능한 변수
- `const`: 재할당할 수 없는 변수

조금 더 깊게 보면 `let`과 `const`는 TDZ 때문에 선언 전에 사용할 수 없고, 블록 스코프를 따르기 때문에 변수의 범위를 더 안전하게 관리할 수 있다.

다음 글에서는 JavaScript의 자료형을 원시 타입과 참조 타입으로 나누어 정리한다.
