# 비동기 처리의 시작

JavaScript를 사용하다 보면 서버에서 데이터를 가져오거나, 일정 시간이 지난 뒤 코드를 실행하는 작업을 자주 하게 된다. 이런 작업은 바로 결과가 나오지 않을 수 있다.

JavaScript에서는 이런 작업을 비동기 처리로 다룬다.

## 동기와 비동기

동기 처리는 코드가 위에서 아래로 순서대로 실행되는 방식이다.

```js
console.log("첫 번째");
console.log("두 번째");
console.log("세 번째");
```

실행 결과:

```text
첫 번째
두 번째
세 번째
```

위 코드는 순서대로 출력된다.

비동기 처리는 어떤 작업이 끝날 때까지 기다리지 않고 다음 코드를 먼저 실행할 수 있는 방식이다.

```js
console.log("첫 번째");

setTimeout(() => {
  console.log("두 번째");
}, 1000);

console.log("세 번째");
```

실행 결과:

```text
첫 번째
세 번째
두 번째
```

이 코드는 `첫 번째`, `세 번째`, `두 번째` 순서로 출력된다.

## 왜 비동기가 필요할까?

서버에서 데이터를 받아오는 작업은 시간이 걸릴 수 있다. 만약 JavaScript가 그 작업이 끝날 때까지 아무것도 하지 못한다면 화면이 멈춘 것처럼 느껴질 수 있다.

비동기 처리를 사용하면 시간이 걸리는 작업을 기다리는 동안 다른 코드를 실행할 수 있다.

대표적인 비동기 작업은 다음과 같다.

- 타이머
- 서버 API 요청
- 파일 읽기
- 이벤트 처리

## `setTimeout`

`setTimeout`은 일정 시간이 지난 뒤 함수를 실행한다.

```js
setTimeout(() => {
  console.log("1초 뒤 실행");
}, 1000);
```

실행 결과:

```text
1초 뒤 실행
```

두 번째 인자로 전달한 숫자는 밀리초 단위다. `1000`은 1초를 의미한다.

## 콜백 함수

비동기 작업이 끝난 뒤 실행할 함수를 콜백 함수라고 부른다.

```js
function fetchData(callback) {
  setTimeout(() => {
    const data = "서버 데이터";
    callback(data);
  }, 1000);
}

fetchData((result) => {
  console.log(result);
});
```

실행 결과:

```text
서버 데이터
```

`fetchData`는 1초 뒤에 데이터를 만들고, 전달받은 콜백 함수를 실행한다.

## 콜백이 많아지면 생기는 문제

콜백을 계속 중첩하면 코드가 점점 읽기 어려워질 수 있다.

```js
setTimeout(() => {
  console.log("첫 번째 작업");

  setTimeout(() => {
    console.log("두 번째 작업");

    setTimeout(() => {
      console.log("세 번째 작업");
    }, 1000);
  }, 1000);
}, 1000);
```

실행 결과:

```text
첫 번째 작업
두 번째 작업
세 번째 작업
```

이런 코드는 흐름을 파악하기 어렵다. 그래서 JavaScript에서는 `Promise`와 `async` / `await` 같은 문법을 사용해 비동기 코드를 더 읽기 쉽게 작성한다.

## Promise 맛보기

`Promise`는 비동기 작업의 성공 또는 실패를 표현하는 객체다.

```js
const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("작업 완료");
  }, 1000);
});

promise.then((result) => {
  console.log(result);
});
```

실행 결과:

```text
작업 완료
```

`resolve`는 작업이 성공했을 때 결과를 전달하는 역할을 한다.

## `async` / `await` 맛보기

`async` / `await`를 사용하면 비동기 코드를 동기 코드처럼 읽기 쉽게 작성할 수 있다.

```js
function wait() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("완료");
    }, 1000);
  });
}

async function run() {
  const result = await wait();
  console.log(result);
}

run();
```

실행 결과:

```text
완료
```

`await`는 Promise가 처리될 때까지 기다렸다가 결과를 받아온다.

## 정리

비동기 처리는 시간이 걸리는 작업을 효율적으로 다루기 위한 방식이다. JavaScript에서는 콜백 함수, Promise, `async` / `await`를 이용해 비동기 코드를 작성한다.

이번 글은 비동기 처리의 시작만 가볍게 다뤘다. 이후 ES6+ 문법 파트에서 Promise와 `async` / `await`를 더 자세히 정리할 예정이다.

다음 글부터는 ES6+ 핵심 문법을 본격적으로 살펴본다.
