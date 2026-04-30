# 스코프와 호이스팅

JavaScript를 공부하다 보면 스코프와 호이스팅이라는 개념을 자주 만나게 된다. 처음에는 어렵게 느껴질 수 있지만, 변수와 함수가 어디에서 접근 가능한지 이해하는 개념이라고 생각하면 된다.

## 스코프란?

스코프는 변수에 접근할 수 있는 범위를 의미한다. (가시성)

```js
const name = "JavaScript";

function printName() {
  console.log(name);
}

printName();
```

실행 결과:

```text
JavaScript
```

위 코드에서 `name`은 함수 밖에서 선언되었지만, 함수 안에서도 접근할 수 있다.

## 전역 스코프

함수나 블록 밖에서 선언한 변수는 전역 스코프를 가진다.

```js
const message = "hello";

function printMessage() {
  console.log(message);
}

printMessage();
```

실행 결과:

```text
hello
```

전역 변수는 여러 곳에서 접근할 수 있다. 편리하지만 어디서든 변경될 수 있기 때문에 많이 사용하면 코드 관리가 어려워질 수 있다.

## 함수 스코프

함수 안에서 선언한 변수는 함수 밖에서 접근할 수 없다.

```js
function createMessage() {
  const message = "hello";
  console.log(message);
}

createMessage();

// console.log(message); // ReferenceError
```

실행 결과:

```text
hello
```

함수 안의 변수는 함수가 실행되는 동안 해당 함수 안에서만 사용할 수 있다.

## 블록 스코프

`let`과 `const`는 블록 스코프를 따른다. 블록은 `{}`로 감싸진 영역이다.

```js
if (true) {
  const message = "hello";
  console.log(message);
}

// console.log(message); // ReferenceError
```

실행 결과:

```text
hello
```

반면 `var`는 블록 스코프를 따르지 않는다.

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

이런 차이 때문에 새 코드를 작성할 때는 `var`보다 `let`, `const`를 사용하는 것이 좋다.

## 스코프 체인

함수 안에서 변수를 찾을 때, JavaScript는 먼저 현재 스코프에서 찾고 없으면 바깥 스코프로 올라가며 찾는다.

```js
const globalMessage = "global";

function outer() {
  const outerMessage = "outer";

  function inner() {
    const innerMessage = "inner";

    console.log(innerMessage);
    console.log(outerMessage);
    console.log(globalMessage);
  }

  inner();
}

outer();
```

실행 결과:

```text
inner
outer
global
```

이처럼 안쪽 스코프에서 바깥쪽 스코프의 변수에 접근할 수 있다.

## 호이스팅이란?

호이스팅은 변수와 함수 선언이 코드의 위쪽으로 끌어올려진 것처럼 동작하는 JavaScript의 특징이다.

함수 선언문은 선언보다 먼저 호출할 수 있다.

```js
sayHello();

function sayHello() {
  console.log("hello");
}
```

실행 결과:

```text
hello
```

실제로 코드가 이동하는 것은 아니지만, JavaScript가 실행 전에 선언을 먼저 처리하기 때문에 이런 동작이 가능하다.

## `var`의 호이스팅

`var`로 선언한 변수는 선언이 끌어올려지고, 값은 나중에 할당된다.

```js
console.log(name);

var name = "JavaScript";
```

실행 결과:

```text
undefined
```

위 코드는 에러가 나지 않고 `undefined`가 출력된다. 선언은 먼저 처리되지만 값 할당은 원래 위치에서 실행되기 때문이다.

## `let`과 `const`의 호이스팅

`let`과 `const`도 호이스팅은 되지만, 선언 전에 접근하면 에러가 발생한다.

```js
// console.log(name); // ReferenceError

const name = "JavaScript";
```

이 덕분에 선언 전에 실수로 변수를 사용하는 문제를 더 빨리 발견할 수 있다.

## 정리

스코프는 변수에 접근할 수 있는 범위이고, 호이스팅은 선언이 먼저 처리되는 JavaScript의 특징이다.

`var`는 헷갈리는 동작이 많기 때문에 새 코드를 작성할 때는 `const`와 `let`을 기본으로 사용하는 것이 좋다.

다음 글에서는 스코프와 밀접하게 연결된 클로저를 정리한다.

(정적과 동적스코프, 변수숨기기 좀더 복잡한 스코프 범위)