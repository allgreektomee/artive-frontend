# JavaScript ES6+ 블로그 시리즈 목차

## 시리즈 목표

이 시리즈는 JavaScript를 처음 다시 정리하는 사람도 따라올 수 있도록 기본 개념부터 ES6+ 문법, 표준 라이브러리, 브라우저 환경, Node.js, 실무 도구까지 차근차근 정리하는 것을 목표로 한다.

책의 목차를 그대로 따라가기보다는 블로그 흐름에 맞게 재구성한다. 다만 JavaScript의 어휘 구조, 타입, 표현식, 문, 객체, 배열, 함수, 클래스, 모듈, 표준 라이브러리, 이터레이터, 비동기, 메타프로그래밍, 브라우저, Node.js, 개발 도구까지 핵심 주제는 빠지지 않게 다룬다.

## 표준 기준

JavaScript의 공식 표준 이름은 ECMAScript다. `ES6`는 2015년에 나온 `ES2015`를 의미하고, 그 이후부터는 매년 `ES2016`, `ES2017`처럼 연도별 표준이 발표된다.

이 시리즈에서 `ES6+`는 `ES2015` 이후의 현대 JavaScript 문법 전체를 의미한다. 기본 문법은 ES6 이후 실무에서 널리 쓰이는 기능을 중심으로 설명하고, 최신 기능은 브라우저와 Node.js 지원 상황을 함께 확인하며 필요한 부분에서 다룬다.

현재 기준으로는 `ES2025`가 최신 확정 표준이고, `ES2026`은 후보 단계다. 최신 표준에서 특히 눈여겨볼 기능은 다음과 같다.

- `ES2025`: Iterator Helpers, Set 메서드, JSON Modules, Import Attributes, `RegExp.escape()`, `Promise.try()`, `Float16Array`
- `ES2026`: Temporal, `Array.fromAsync`, Uint8Array Base64 변환, Iterator Sequencing, `Math.sum`, JSON.parse source text access

블로그 제목은 `JavaScript ES6+`로 유지하되, 내용은 최신 ECMAScript 흐름까지 따라간다.

## 폴더 구조

각 부는 별도 폴더로 관리한다. 파일 이름은 작성 순서를 알 수 있도록 숫자 접두어를 붙인다.

```text
js-blog-es6/
  00-outline.md
  part-1-basics/
  part-2-standard-library/
  part-3-runtime-and-tools/
```

## 1부. JavaScript 기본기

처음 배우는 사람이 개념을 잡는 구간이다. 변수, 자료형, 조건문, 반복문, 함수처럼 모든 JavaScript 코드의 바탕이 되는 내용을 천천히 설명한다. 기존 2부와 겹치던 ES6+ 핵심 문법은 이 파트에 흡수해서 한 흐름으로 읽히게 한다.

1. JavaScript란 무엇인가?
2. 변수: `var`, `let`, `const`
3. 자료형: 원시 타입과 참조 타입
4. 연산자와 조건문
5. 반복문
6. 함수 기본
7. 스코프와 호이스팅
8. 클로저
9. `this`
10. 객체와 배열 실전 기본
11. 클래스와 인스턴스 기본
12. 모듈과 파일 구조 기본
13. 비동기 처리의 시작

## 2부. 표준 라이브러리와 고급 문법

기본 문법 위에서 JavaScript가 제공하는 표준 객체와 고급 기능을 다룬다. 데이터 구조, 정규 표현식, 날짜, 에러, JSON, 이터레이터, Promise, 메타프로그래밍처럼 실무에서 필요할 때 찾아 쓰는 주제를 묶는다.

아래 번호는 책식으로 잘게 쪼갠 목차를 **한 편(또는 한 묶음) 단위**로 합친 것이다. 글을 쓸 때는 번호 안에서 소제목으로 나누면 된다.

1. **Set·Map·WeakSet·WeakMap** — 컬렉션과 약한 참조
2. **형식화 배열과 이진 데이터**
3. **정규 표현식과 패턴 매칭**
4. **날짜·에러·JSON** — `Date`, `Error`와 직렬화·분석
5. **Intl·콘솔·URL·타이머** — 국제화, 로깅, 주소 파싱, `setTimeout` 등
6. **이터레이터·이터러블·제너레이터** — 동작, 직접 만들기, 고급 `yield` 활용
7. **비동기 전체 흐름** — 콜백, Promise·체이닝·에러, `async`/`await`, 비동기 순회
8. **심벌과 객체 내부** — 잘 알려진 심벌, 프로퍼티 속성, 확장성, 프로토타입 서술자
9. **템플릿 태그와 메타프로그래밍** — `Reflect`, `Proxy`, 실무에서 쓰는 시점

## 3부. 실행 환경과 실무 JavaScript

브라우저와 Node.js에서 JavaScript가 실제로 어떻게 실행되는지 다룬다. DOM, 이벤트, 네트워크 요청, 저장소, Worker, Node.js API, npm, 린팅, 포맷팅, 테스트, 번들러 같은 실무 도구까지 이어간다.

2부와 같이, 세부 목차는 **한 편 단위**로 묶어 두었다. 글 안에서는 소제목으로 나누면 된다.

1. **브라우저 실행과 DOM 기초** — 실행 흐름, DOM 개념, 선택·조작
2. **이벤트와 폼** — 이벤트 모델, 위임, 입력값 처리
3. **CSS 연동과 레이아웃** — 스타일을 JS로 다루기, 위치·크기·스크롤
4. **컴포넌트·그래픽·미디어 맛보기** — Web Component, SVG, Canvas, 오디오 API
5. **내비게이션·네트워크·저장소·Worker** — 히스토리·내비, `fetch`, `localStorage`/`sessionStorage`, Web Worker
6. **Node.js 핵심** — 입문, 비동기 모델, `Buffer`, `EventEmitter`, Stream
7. **Node.js 시스템·파일·네트워크·병렬** — 프로세스/OS 정보, 파일, HTTP·TCP, 자식 프로세스, Worker Threads
8. **npm과 코드 품질** — 패키지 관리, ESLint, Prettier, Jest
9. **빌드·트랜스파일·JSX·타입과 마무리** — 번들러, Babel, JSX, TypeScript 입문, 미니 프로젝트

## 추천 작성 순서

처음에는 너무 깊게 들어가기보다, 각 글마다 하나의 핵심 주제만 다룬다. 예제 코드는 짧게 유지하고, 반드시 실행 결과를 함께 보여준다.

책의 세부 주제를 모두 한 글씩 분리하면 글 수가 너무 많아질 수 있으므로, 블로그에서는 가까운 주제를 묶어도 된다. 예를 들어 `Set`, `Map`, `WeakMap`은 한두 편으로 묶고, 브라우저 API 중 자주 쓰지 않는 SVG, Canvas, Audio API는 맛보기 글로 가볍게 다룬다.
