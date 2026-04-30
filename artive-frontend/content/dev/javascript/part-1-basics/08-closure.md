# 클로저

클로저는 JavaScript에서 처음 배우기 어려운 개념 중 하나다. 하지만 스코프를 이해하고 나면 클로저도 조금 더 쉽게 이해할 수 있다.

클로저는 함수가 자신이 만들어진 스코프의 변수를 기억하는 현상이다.

## 함수 안의 함수

먼저 함수 안에서 또 다른 함수를 만들어보자.

```js
function outer() {
  const message = "hello";

  function inner() {
    console.log(message);
  }

  inner();
}

outer();
```

실행 결과:

```text
hello
```

`inner` 함수는 자기 안에 `message`가 없지만, 바깥 함수인 `outer`의 변수에 접근할 수 있다.

이것은 스코프 체인 때문에 가능하다.

## 함수가 끝난 뒤에도 기억한다

클로저가 흥미로운 이유는 바깥 함수의 실행이 끝난 뒤에도 내부 함수가 그 변수를 기억할 수 있다는 점이다.

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

console.log(counter());
console.log(counter());
console.log(counter());
```

실행 결과:

```text
1
2
3
```

`createCounter` 함수는 실행을 마치고 종료되었다. 그런데 `counter`를 호출할 때마다 `count` 값이 계속 유지된다.

이처럼 내부 함수가 외부 함수의 변수에 접근하고, 그 변수를 기억하는 것이 클로저다.

## 클로저를 사용하는 이유

클로저는 값을 외부에서 직접 변경하지 못하게 숨기고, 필요한 함수로만 다루고 싶을 때 사용할 수 있다.

```js
function createWallet(initialMoney) {
  let money = initialMoney;

  return {
    getMoney() {
      return money;
    },
    addMoney(amount) {
      money += amount;
    },
  };
}

const wallet = createWallet(1000);

wallet.addMoney(500);

console.log(wallet.getMoney());
```

실행 결과:

```text
1500
```

`money`는 `createWallet` 함수 안에 있기 때문에 바깥에서 직접 접근할 수 없다. 대신 `getMoney`, `addMoney`를 통해서만 다룰 수 있다.

## 클로저와 데이터 보호

다음 코드를 보자.

```js
function createUser(name) {
  let loginCount = 0;

  return {
    getName() {
      return name;
    },
    login() {
      loginCount++;
      return loginCount;
    },
  };
}

const user = createUser("Kim");

console.log(user.getName());
console.log(user.login());
console.log(user.login());
```

실행 결과:

```text
Kim
1
2
```

`loginCount`는 외부에서 직접 수정할 수 없다. 함수가 제공한 방법으로만 값을 변경할 수 있다.

이런 방식은 객체의 내부 상태를 보호하는 데 도움이 된다.

## 반복문에서의 클로저

예전 JavaScript 코드에서는 `var`와 클로저 때문에 헷갈리는 상황이 자주 있었다.

```js
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
```

실행 결과:

```text
3
3
3
```

이 코드는 `0`, `1`, `2`가 아니라 `3`, `3`, `3`을 출력한다. `var`는 블록 스코프가 없어서 모든 함수가 같은 `i`를 바라보기 때문이다.

`let`을 사용하면 반복마다 새로운 블록 스코프가 만들어져 더 자연스럽게 동작한다.

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
```

실행 결과:

```text
0
1
2
```

## 정리

클로저는 함수가 자신이 만들어진 환경의 변수를 기억하는 현상이다. 처음에는 어렵게 느껴지지만, 스코프 체인을 이해하면 자연스럽게 연결된다.

클로저는 상태 유지, 데이터 보호, 콜백 함수에서 자주 사용된다.

다음 글에서는 JavaScript에서 자주 헷갈리는 `this`를 정리한다.
