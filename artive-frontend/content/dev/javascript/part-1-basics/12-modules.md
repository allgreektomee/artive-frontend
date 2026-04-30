# 모듈과 파일 구조 기본

코드가 길어지면 파일을 나눠야 한다. 모듈은 필요한 값만 내보내고 가져오는 방식으로, 전역 변수 충돌을 줄이고 파일의 역할을 명확하게 만든다.

모듈은 코드를 파일 단위로 나누고 필요한 값만 외부에 공개하는 방법이다. 전역 변수 충돌을 줄이고, 역할별로 코드를 관리하기 쉽게 만든다.

## 이 글의 위치

모듈은 코드를 파일 단위로 나누는 방법이다. 프로젝트가 커질수록 어떤 파일이 어떤 책임을 갖는지 정리하는 능력이 중요해진다.

## 먼저 잡을 핵심

- 전역 변수 충돌을 줄일 수 있다.
- 필요한 값만 `export`하고 필요한 곳에서 `import`한다.
- Node.js에서는 CommonJS와 ES 모듈을 모두 만날 수 있다.

## 실무 감각으로 보는 예제

실제 모듈 코드는 여러 파일이 필요하므로 예제에서는 주석으로 표현했다. 핵심은 파일이 맡은 역할을 작게 유지하는 것이다.

```js
// formatDate.js
// export function formatDate(value) {
//   return value.slice(0, 10);
// }

// post.js
// import { formatDate } from './formatDate.js';

console.log('module example');
```

실행 결과:

```text
module example
```

## 객체로 모듈처럼 묶기

```js
const mathModule = {
  add(a, b) {
    return a + b;
  },
};

console.log(mathModule.add(2, 3));
```

실행 결과:

```text
5
```

## 클로저 모듈 패턴

```js
const counterModule = (() => {
  let count = 0;

  return {
    increase() {
      count++;
      return count;
    },
  };
})();

console.log(counterModule.increase());
console.log(counterModule.increase());
```

실행 결과:

```text
1
2
```

## CommonJS와 ES 모듈

```js
// CommonJS
// const fs = require('fs');

// ES Module
// import fs from 'node:fs';

console.log('module syntax');
```

실행 결과:

```text
module syntax
```

## 자주 헷갈리는 부분

- 기본 예제는 문법을 보여주기 위한 것이고, 실무 코드는 데이터 이름과 흐름이 더 중요하다.
- 같은 문법이라도 원본 값을 바꾸는지, 새 값을 만드는지 확인해야 한다.
- 짧게 쓰는 것보다 다음 사람이 읽고 바로 이해하는 코드가 더 좋다.

## 정리

Node.js에서는 CommonJS와 ES 모듈을 모두 볼 수 있다. 최신 프론트엔드와 Node.js 코드에서는 ES 모듈 사용이 늘고 있다.

## 마무리

처음에는 모듈 문법보다 파일의 책임을 나누는 감각이 더 중요하다. 한 파일이 너무 많은 일을 하면 읽기 어렵고, 너무 잘게 나누면 흐름을 따라가기 어렵다. 역할이 분명한 단위로 나누는 연습을 하자.
