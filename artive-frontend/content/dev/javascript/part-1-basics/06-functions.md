# 함수 기본

함수는 특정 작업을 수행하는 코드를 하나로 묶은 것이다. 같은 코드를 여러 번 작성하지 않고, 필요한 곳에서 함수 이름으로 호출할 수 있다.

## 함수가 필요한 이유

예를 들어 인사 메시지를 여러 번 출력해야 한다고 해보자.

```js
console.log("안녕하세요, Kim님");
console.log("안녕하세요, Lee님");
console.log("안녕하세요, Park님");
```

실행 결과:

```text
안녕하세요, Kim님
안녕하세요, Lee님
안녕하세요, Park님
```

이 코드는 이름만 다르고 구조는 같다. 이런 경우 함수를 만들면 더 깔끔하게 작성할 수 있다.

```js
function greet(name) {
  console.log(`안녕하세요, ${name}님`);
}

greet("Kim");
greet("Lee");
greet("Park");
```

실행 결과:

```text
안녕하세요, Kim님
안녕하세요, Lee님
안녕하세요, Park님
```

## 함수 선언문

가장 기본적인 함수 작성 방식은 함수 선언문이다.

```js
function add(a, b) {
  return a + b;
}

const result = add(2, 3);

console.log(result);
```

실행 결과:

```text
5
```

`a`와 `b`는 매개변수이고, `add(2, 3)`에서 전달한 `2`와 `3`은 인자다.

## `return`

`return`은 함수의 결과값을 밖으로 돌려준다.

```js
function double(number) {
  return number * 2;
}

const result = double(5);

console.log(result);
```

실행 결과:

```text
10
```

`return`을 만나면 함수는 값을 반환하고 종료된다.

```js
function checkAge(age) {
  if (age < 20) {
    return "미성년자";
  }

  return "성인";
}
```

## 함수 표현식

함수는 변수에 담을 수도 있다.

```js
const add = function (a, b) {
  return a + b;
};

console.log(add(2, 3));
```

실행 결과:

```text
5
```

이런 방식을 함수 표현식이라고 한다.

## 화살표 함수

ES6부터는 화살표 함수 문법을 사용할 수 있다.

```js
const add = (a, b) => {
  return a + b;
};

console.log(add(2, 3));
```

실행 결과:

```text
5
```

함수의 내용이 한 줄이라면 더 짧게 작성할 수 있다.

```js
const add = (a, b) => a + b;
```

화살표 함수는 실무에서 자주 사용되지만, `this` 동작이 일반 함수와 다르다. 이 부분은 뒤에서 따로 정리한다.

## 기본값 매개변수

매개변수에 기본값을 줄 수도 있다.

```js
function greet(name = "사용자") {
  console.log(`안녕하세요, ${name}님`);
}

greet("Kim");
greet();
```

실행 결과:

```text
안녕하세요, Kim님
안녕하세요, 사용자님
```

인자를 전달하지 않으면 기본값이 사용된다.

## 함수는 값이다

JavaScript에서 함수는 값처럼 다룰 수 있다. 변수에 담을 수 있고, 다른 함수에 전달할 수도 있다.

```js
function sayHello() {
  console.log("hello");
}

const fn = sayHello;

fn();
```

실행 결과:

```text
hello
```

이 특징 덕분에 JavaScript에서는 콜백 함수, 이벤트 처리, 배열 메서드 같은 기능을 자연스럽게 사용할 수 있다.

## 정리

함수는 코드를 재사용 가능한 단위로 묶는 방법이다. 매개변수로 값을 전달하고, `return`으로 결과를 돌려받을 수 있다.

다음 글에서는 함수와 변수를 이해할 때 꼭 필요한 스코프와 호이스팅을 정리한다.



함수 this 키워드 / this 를 self나 that 에할당하는형태 
함수 표현식과 익명함수

함수표현식과 함수선언 차이 ( 호출, 다른곳에 할당이나 다른함수에 넘겨줄목적)
화살표 표기법에서 this
call apply bind