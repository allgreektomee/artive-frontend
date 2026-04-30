# `this`

JavaScript에서 `this`는 많은 사람이 헷갈려하는 개념이다. 이유는 `this`가 함수가 선언된 위치가 아니라, 어떻게 호출되었는지에 따라 달라질 수 있기 때문이다.

## `this`란?

`this`는 현재 실행 중인 코드에서 참조하는 대상을 가리키는 키워드다.

객체의 메서드 안에서는 보통 그 메서드를 호출한 객체를 가리킨다.

```js
const user = {
  name: "Kim",
  sayHello() {
    console.log(`안녕하세요, ${this.name}님`);
  },
};

user.sayHello();
```

실행 결과:

```text
안녕하세요, Kim님
```

여기서 `this`는 `user` 객체를 가리킨다.

## 호출 방식이 중요하다

`this`는 함수가 어디에 작성되었는지보다 어떻게 호출되었는지가 중요하다.

```js
const user = {
  name: "Kim",
  sayHello() {
    console.log(this.name);
  },
};

user.sayHello();
```

실행 결과:

```text
Kim
```

`user.sayHello()`처럼 객체를 통해 호출하면 `this`는 `user`가 된다.

하지만 함수를 따로 꺼내서 호출하면 결과가 달라질 수 있다.

```js
"use strict";

const user = {
  name: "Kim",
  sayHello() {
    console.log(this.name);
  },
};

const sayHello = user.sayHello;

sayHello();
```

실행 결과:

```text
TypeError: Cannot read properties of undefined (reading 'name')
```

이 경우 `this`는 더 이상 `user`를 가리키지 않는다. 엄격 모드에서는 `this`가 `undefined`가 되기 때문에 `this.name`에서 에러가 발생한다.

## 일반 함수에서의 `this`

일반 함수에서 `this`는 실행 환경과 호출 방식에 따라 달라진다.

```js
function showThis() {
  console.log(this);
}

showThis();
```

실행 결과:

```text
브라우저 일반 모드: Window 객체
엄격 모드 또는 모듈 환경: undefined
```

브라우저의 일반 모드에서는 `window`를 가리킬 수 있고, 엄격 모드에서는 `undefined`가 될 수 있다.

이런 차이 때문에 일반 함수의 `this`는 항상 호출 방식을 함께 봐야 한다.

## 메서드에서의 `this`

객체의 메서드로 호출하면 `this`는 해당 객체를 가리킨다.

```js
const calculator = {
  value: 10,
  add(number) {
    this.value += number;
    return this.value;
  },
};

console.log(calculator.add(5));
```

실행 결과:

```text
15
```

`calculator.add(5)`로 호출했기 때문에 `this`는 `calculator`다.

## 화살표 함수의 `this`

화살표 함수는 자기만의 `this`를 가지지 않는다. 대신 바깥 스코프의 `this`를 그대로 사용한다.

```js
const user = {
  name: "Kim",
  sayHello: () => {
    console.log(this.name);
  },
};

user.sayHello();
```

실행 결과:

```text
undefined
```

이 코드는 기대한 대로 동작하지 않을 수 있다. 객체의 메서드에는 일반 함수 문법을 사용하는 것이 더 적절한 경우가 많다.

```js
const user = {
  name: "Kim",
  sayHello() {
    console.log(this.name);
  },
};
```

## 콜백 함수에서의 `this`

콜백 함수 안에서 `this`가 바뀌어 헷갈리는 경우도 많다.

```js
const user = {
  name: "Kim",
  printLater() {
    setTimeout(function () {
      console.log(this.name);
    }, 1000);
  },
};

user.printLater();
```

실행 결과:

```text
undefined
```

`setTimeout` 안의 일반 함수는 `user`의 메서드로 호출된 것이 아니기 때문에 `this`가 `user`를 가리키지 않는다.

이럴 때 화살표 함수를 사용하면 바깥의 `this`를 유지할 수 있다.

```js
const user = {
  name: "Kim",
  printLater() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  },
};

user.printLater();
```

실행 결과:

```text
Kim
```

## 함수 선언문, 함수 표현식, 익명 함수와 `this`

함수는 함수 선언문으로 만들 수도 있고, 함수 표현식으로 변수에 담을 수도 있다.

```js
function sayHello() {
  console.log(this.name);
}

const sayHi = function () {
  console.log(this.name);
};
```

`sayHello`는 함수 선언문이고, `sayHi`에 담긴 함수는 이름이 없는 익명 함수다. 하지만 `this`는 함수 선언문인지 함수 표현식인지로 결정되지 않는다.

중요한 것은 여전히 "어떻게 호출했는가"다.

```js
const user = {
  name: "Kim",
  sayHello: function () {
    console.log(this.name);
  },
};

user.sayHello();
```

실행 결과:

```text
Kim
```

함수가 객체의 메서드로 호출되었기 때문에 `this`는 `user`를 가리킨다.

반대로 같은 함수를 변수에 따로 담아 호출하면 `this`가 달라질 수 있다.

```js
"use strict";

const user = {
  name: "Kim",
  sayHello: function () {
    console.log(this.name);
  },
};

const fn = user.sayHello;

fn();
```

실행 결과:

```text
TypeError: Cannot read properties of undefined (reading 'name')
```

함수를 다른 곳에 할당하거나 다른 함수에 넘겨줄 때는 호출 방식이 바뀌면서 `this`도 함께 바뀔 수 있다는 점을 조심해야 한다.

## `self`나 `that`에 `this` 저장하기

화살표 함수가 널리 사용되기 전에는 콜백 함수 안에서 바깥의 `this`를 사용하기 위해 `self`나 `that` 같은 변수에 저장하는 방식을 자주 사용했다.

```js
const user = {
  name: "Kim",
  printLater() {
    const self = this;

    setTimeout(function () {
      console.log(self.name);
    }, 1000);
  },
};

user.printLater();
```

실행 결과:

```text
Kim
```

`setTimeout` 안의 일반 함수에서 `this`는 `user`가 아니지만, `self`에는 바깥 메서드의 `this`가 저장되어 있기 때문에 `user.name`에 접근할 수 있다.

요즘은 같은 상황에서 화살표 함수를 더 자주 사용한다.

```js
const user = {
  name: "Kim",
  printLater() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  },
};

user.printLater();
```

실행 결과:

```text
Kim
```

화살표 함수는 자기만의 `this`를 만들지 않기 때문에 바깥 메서드의 `this`를 그대로 사용한다.

## `call`, `apply`, `bind`

`this`를 직접 지정해서 함수를 호출해야 할 때는 `call`, `apply`, `bind`를 사용할 수 있다.

```js
function introduce(job) {
  console.log(`${this.name}은 ${job}입니다.`);
}

const user = {
  name: "Kim",
};

introduce.call(user, "개발자");
```

실행 결과:

```text
Kim은 개발자입니다.
```

`call`은 첫 번째 인자로 `this`가 될 값을 받고, 그 뒤에 함수 인자를 하나씩 전달한다.

`apply`도 비슷하지만 함수 인자를 배열로 전달한다.

```js
function introduce(job, city) {
  console.log(`${this.name}은 ${city}의 ${job}입니다.`);
}

const user = {
  name: "Kim",
};

introduce.apply(user, ["개발자", "서울"]);
```

실행 결과:

```text
Kim은 서울의 개발자입니다.
```

`bind`는 함수를 바로 실행하지 않고, `this`가 고정된 새 함수를 만든다.

```js
function introduce() {
  console.log(this.name);
}

const user = {
  name: "Kim",
};

const boundIntroduce = introduce.bind(user);

boundIntroduce();
```

실행 결과:

```text
Kim
```

정리하면 `call`과 `apply`는 함수를 즉시 실행하고, `bind`는 나중에 실행할 새 함수를 만든다.

## 정리

`this`는 함수가 어떻게 호출되었는지에 따라 달라진다. 객체의 메서드로 호출하면 보통 그 객체를 가리키고, 화살표 함수는 자기만의 `this`를 만들지 않는다.

함수를 변수에 담거나 다른 함수에 넘길 때는 호출 방식이 바뀌면서 `this`도 달라질 수 있다. `this`가 헷갈릴 때는 "이 함수가 어떻게 호출되고 있는가?"를 먼저 확인하면 된다.

필요하다면 `call`, `apply`, `bind`로 `this`를 명시적으로 지정할 수 있다.

다음 글에서는 JavaScript에서 시간이 걸리는 작업을 다루는 비동기 처리의 시작을 정리한다.
