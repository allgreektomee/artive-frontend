# 클래스와 인스턴스 기본

JavaScript를 처음 배울 때 클래스는 너무 깊게 들어가기보다, 객체를 만드는 문법으로 이해하면 충분하다. 인스턴스가 무엇인지, 메서드는 어디에 정의되는지, 상속은 언제 쓰는지만 잡고 넘어가자.

## 클래스와 프로토타입

자바스크립트의 클래스는 프로토타입 기반 객체 모델 위에 만들어진 문법이다. 생성자 함수, 프로토타입, `class`, 인스턴스를 함께 이해하면 클래스 문법이 더 자연스럽다.

## 이 글의 위치

클래스는 객체를 만들기 위한 문법이고, 프로토타입은 메서드 공유의 기반이다. 둘을 함께 이해하면 `this`, 인스턴스, 상속이 덜 헷갈린다.

## 먼저 잡을 핵심

- 인스턴스마다 데이터는 다를 수 있다.
- 메서드는 프로토타입을 통해 공유된다.
- `class`는 프로토타입 기반 동작을 더 읽기 쉽게 만든 문법이다.

## 실무 감각으로 보는 예제

`a`와 `b`는 서로 다른 인스턴스다. 같은 클래스로 만들었지만 내부 상태는 따로 가진다.

```js
class Counter {
  constructor() {
    this.count = 0;
  }

  increase() {
    this.count += 1;
    return this.count;
  }
}

const a = new Counter();
const b = new Counter();

console.log(a.increase());
console.log(a.increase());
console.log(b.increase());
```

실행 결과:

```text
1
2
1
```

## 프로토타입 확인

```js
const user = { name: 'Kim' };

console.log(Object.getPrototypeOf(user) === Object.prototype);
```

실행 결과:

```text
true
```

## 생성자 함수와 인스턴스

```js
function User(name) {
  this.name = name;
}

const user = new User('Kim');

console.log(user instanceof User);
console.log(user.name);
```

실행 결과:

```text
true
Kim
```

## class 문법

```js
class User {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    return `Hello, ${this.name}`;
  }
}

const user = new User('Kim');
console.log(user.sayHello());
```

실행 결과:

```text
Hello, Kim
```

## 자주 헷갈리는 부분

- 기본 예제는 문법을 보여주기 위한 것이고, 실무 코드는 데이터 이름과 흐름이 더 중요하다.
- 같은 문법이라도 원본 값을 바꾸는지, 새 값을 만드는지 확인해야 한다.
- 짧게 쓰는 것보다 다음 사람이 읽고 바로 이해하는 코드가 더 좋다.

## 정리

클래스는 새로운 객체를 만들기 위한 설계도처럼 사용할 수 있다.

## 상속과 확장

상속은 기존 클래스의 기능을 물려받아 새 클래스를 만들 때 사용한다. 필요한 경우에는 유용하지만, 무리하게 사용하면 구조가 복잡해질 수 있다.

## 이 글의 위치

상속은 기존 클래스의 기능을 이어받아 새 클래스를 만들 때 사용한다. 하지만 모든 재사용을 상속으로 해결하려고 하면 구조가 쉽게 무거워진다.

## 먼저 잡을 핵심

- `extends`는 부모 클래스를 상속한다.
- `super()`는 부모 생성자를 호출한다.
- 단순 기능 조합은 상속보다 객체 조합이 나을 수 있다.

## 실무 감각으로 보는 예제

부모 기능을 일부 유지하면서 자식 클래스에서 결과를 확장하고 싶을 때 `super.method()`를 사용할 수 있다.

```js
class Page {
  title() {
    return '기본 페이지';
  }
}

class BlogPage extends Page {
  title() {
    return `${super.title()} - 블로그`;
  }
}

const page = new BlogPage();
console.log(page.title());
```

실행 결과:

```text
기본 페이지 - 블로그
```

## 기존 클래스에 메서드 추가

```js
class User {
  constructor(name) {
    this.name = name;
  }
}

User.prototype.sayName = function () {
  return this.name;
};

const user = new User('Kim');
console.log(user.sayName());
```

실행 결과:

```text
Kim
```

## extends와 super

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name}이 소리를 냅니다.`;
  }
}

class Dog extends Animal {
  speak() {
    return `${this.name}이 멍멍 짖습니다.`;
  }
}

const dog = new Dog('초코');
console.log(dog.speak());
```

실행 결과:

```text
초코이 멍멍 짖습니다.
```

## 자주 헷갈리는 부분

- 기본 예제는 문법을 보여주기 위한 것이고, 실무 코드는 데이터 이름과 흐름이 더 중요하다.
- 같은 문법이라도 원본 값을 바꾸는지, 새 값을 만드는지 확인해야 한다.
- 짧게 쓰는 것보다 다음 사람이 읽고 바로 이해하는 코드가 더 좋다.

## 정리

상속보다 객체 조합이 더 단순한 경우도 많다. 먼저 구조를 단순하게 유지하는 쪽을 고려하자.

## 마무리

클래스는 관련 있는 데이터와 동작을 함께 묶는 방법이다. 다만 단순한 데이터까지 모두 클래스로 만들 필요는 없다. 객체 리터럴, 함수, 클래스 중 어떤 표현이 가장 단순한지 먼저 생각하자.
