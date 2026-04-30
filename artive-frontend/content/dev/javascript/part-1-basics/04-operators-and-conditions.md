# 연산자와 조건문

프로그램은 값을 계산하고, 상황에 따라 다른 코드를 실행한다. JavaScript에서 값을 계산할 때는 연산자를 사용하고, 조건에 따라 흐름을 나눌 때는 조건문을 사용한다.

## 문이란?

JavaScript에서 문은 프로그램을 구성하는 실행 단위다. 영어로는 statement라고 부른다.

```js
const name = "JavaScript";

console.log(name);
```

실행 결과:

```text
JavaScript
```

위 코드에서 `const name = "JavaScript";`는 변수 선언문이고, `console.log(name);`은 표현식문이다.

문에는 여러 종류가 있다.

- 변수 선언문
- 표현식문
- 블록문
- 조건문
- 반복문
- 흐름 제어문

## 표현식과 문의 차이

표현식은 값으로 평가될 수 있는 코드다.

```js
10 + 20;
"hello";
age >= 20;
```

위 코드는 각각 숫자, 문자열, 불리언 값으로 평가된다.

문은 어떤 동작을 수행하는 코드 단위다.

```js
const age = 20;

if (age >= 20) {
  console.log("성인입니다.");
}
```

실행 결과:

```text
성인입니다.
```

`if`문은 조건에 따라 코드를 실행하는 문이다. 자체가 하나의 값으로 평가되는 표현식은 아니다.

## 블록문

블록문은 여러 문을 `{}`로 묶은 것이다.

```js
{
  const message = "hello";
  console.log(message);
}
```

실행 결과:

```text
hello
```

블록문은 `if`, `for`, `while`, 함수 등에서 자주 사용된다.

## 연산자란?

연산자는 값을 계산하거나 비교할 때 사용하는 기호다.

```js
const sum = 10 + 5;
const isSame = 10 === 10;

console.log(sum);
console.log(isSame);
```

실행 결과:

```text
15
true
```

## 산술 연산자

산술 연산자는 숫자를 계산할 때 사용한다.

```js
console.log(10 + 3);
console.log(10 - 3);
console.log(10 * 3);
console.log(10 / 3);
console.log(10 % 3);
```

실행 결과:

```text
13
7
30
3.3333333333333335
1
```

`%`는 나머지를 구하는 연산자다.

```js
const number = 7;

console.log(number % 2);
```

실행 결과:

```text
1
```

나머지를 이용하면 홀수와 짝수를 구분할 수 있다.

## 할당 연산자

할당 연산자는 변수에 값을 넣을 때 사용한다.

```js
let count = 0;

count = count + 1;
count += 1;
count++;

console.log(count);
```

실행 결과:

```text
3
```

`count += 1`은 `count = count + 1`과 같은 의미다.

## 비교 연산자

비교 연산자는 두 값을 비교하고 `true` 또는 `false`를 반환한다.

```js
console.log(10 > 5);
console.log(10 < 5);
console.log(10 >= 10);
console.log(10 <= 9);
console.log(10 === 10);
console.log(10 !== 5);
```

실행 결과:

```text
true
false
true
false
true
true
```

JavaScript에서는 가능하면 `==`보다 `===`를 사용하는 것이 좋다.

```js
console.log(1 == "1");
console.log(1 === "1");
```

실행 결과:

```text
true
false
```

`==`는 타입을 자동으로 바꿔 비교할 수 있고, `===`는 타입까지 비교한다. 예측 가능한 코드를 위해 `===`를 기본으로 사용하자.

## 논리 연산자

논리 연산자는 여러 조건을 함께 판단할 때 사용한다.

```js
const age = 20;
const hasTicket = true;

console.log(age >= 18 && hasTicket);
console.log(age >= 18 || hasTicket);
console.log(!hasTicket);
```

실행 결과:

```text
true
true
false
```

- `&&`: 둘 다 참이면 참
- `||`: 하나라도 참이면 참
- `!`: 참과 거짓을 반대로 바꿈

## 조건문 `if`

조건문은 조건에 따라 다른 코드를 실행한다.

```js
const score = 85;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else {
  console.log("C");
}
```

실행 결과:

```text
B
```

조건식이 `true`이면 해당 블록의 코드가 실행된다.

## 조건문 `switch`

`switch`는 하나의 값을 기준으로 여러 경우를 나눌 때 사용한다.

```js
const day = "mon";

switch (day) {
  case "mon":
    console.log("월요일");
    break;
  case "fri":
    console.log("금요일");
    break;
  default:
    console.log("다른 요일");
}
```

실행 결과:

```text
월요일
```

각 `case` 뒤에는 보통 `break`를 넣어준다. `break`가 없으면 다음 `case`까지 이어서 실행될 수 있다.

## `switch`문 자세히 보기

`switch`문은 비교할 값이 하나이고, 가능한 경우가 여러 개일 때 읽기 좋다.

```js
const role = "admin";

switch (role) {
  case "admin":
    console.log("관리자입니다.");
    break;
  case "user":
    console.log("일반 사용자입니다.");
    break;
  case "guest":
    console.log("방문자입니다.");
    break;
  default:
    console.log("알 수 없는 권한입니다.");
}
```

실행 결과:

```text
관리자입니다.
```

`default`는 어떤 `case`에도 해당하지 않을 때 실행된다. `if`문의 `else`와 비슷한 역할이다.

## `break`가 없는 `switch`

`switch`문에서 `break`를 빼면 다음 `case`까지 이어서 실행된다. 이것을 fall-through라고 부른다.

```js
const grade = "B";

switch (grade) {
  case "A":
    console.log("매우 좋음");
  case "B":
    console.log("좋음");
  case "C":
    console.log("보통");
  default:
    console.log("평가 완료");
}
```

실행 결과:

```text
좋음
보통
평가 완료
```

대부분의 경우 의도하지 않은 동작이 될 수 있으므로 각 `case` 뒤에 `break`를 넣는 습관이 좋다.

## 여러 `case`를 묶기

같은 코드를 실행해야 하는 경우 여러 `case`를 묶을 수 있다.

```js
const day = "sat";

switch (day) {
  case "sat":
  case "sun":
    console.log("주말입니다.");
    break;
  case "mon":
  case "tue":
  case "wed":
  case "thu":
  case "fri":
    console.log("평일입니다.");
    break;
  default:
    console.log("잘못된 요일입니다.");
}
```

실행 결과:

```text
주말입니다.
```

`sat`과 `sun`은 같은 결과를 출력해야 하므로 하나로 묶었다.

## `if`문과 `switch`문 선택 기준

조건이 범위나 복잡한 논리라면 `if`문이 더 적합하다.

```js
const score = 85;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else {
  console.log("C");
}
```

실행 결과:

```text
B
```

하나의 값이 여러 정해진 값 중 무엇인지 확인하는 경우라면 `switch`문이 읽기 쉬울 수 있다.

```js
const status = "success";

switch (status) {
  case "loading":
    console.log("로딩 중");
    break;
  case "success":
    console.log("성공");
    break;
  case "error":
    console.log("실패");
    break;
  default:
    console.log("알 수 없음");
}
```

실행 결과:

```text
성공
```

## 삼항 연산자

간단한 조건은 삼항 연산자로 표현할 수 있다.

```js
const age = 20;
const message = age >= 18 ? "성인입니다." : "미성년자입니다.";

console.log(message);
```

실행 결과:

```text
성인입니다.
```

짧은 조건에는 유용하지만, 조건이 복잡해지면 `if`문이 더 읽기 쉽다.

## 정리

연산자는 값을 계산하고 비교할 때 사용한다. 조건문은 조건에 따라 실행할 코드를 나눌 때 사용한다.

다음 글에서는 같은 코드를 여러 번 실행할 때 사용하는 반복문을 정리한다.


void 연산자 , 할당 연산자 , 해체 할당, 표현식과 흐름제어 , 객체와 배열연산자 
