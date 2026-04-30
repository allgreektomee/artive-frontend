# 반복문

반복문은 같은 코드를 여러 번 실행할 때 사용한다. 배열의 모든 값을 출력하거나, 특정 조건이 만족될 때까지 코드를 반복할 때 필요하다.

## 반복문이 필요한 이유

예를 들어 1부터 5까지 출력한다고 해보자.

```js
console.log(1);
console.log(2);
console.log(3);
console.log(4);
console.log(5);
```

실행 결과:

```text
1
2
3
4
5
```

출력할 숫자가 5개라면 직접 작성할 수 있지만, 100개라면 코드가 너무 길어진다. 이럴 때 반복문을 사용한다.

```js
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```

실행 결과:

```text
1
2
3
4
5
```

## `for`문

`for`문은 반복 횟수가 정해져 있을 때 자주 사용한다.

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}
```

실행 결과:

```text
0
1
2
```

`for`문은 세 부분으로 구성된다.

- 초기값
- 반복 조건
- 반복이 끝날 때마다 실행할 코드

```js
for (let i = 0; i < 5; i++) {
  console.log("현재 숫자:", i);
}
```

실행 결과:

```text
현재 숫자: 0
현재 숫자: 1
현재 숫자: 2
현재 숫자: 3
현재 숫자: 4
```

`i`가 5보다 작을 때까지 반복하고, 반복이 한 번 끝날 때마다 `i++`가 실행된다.

## 배열과 `for`문

반복문은 배열과 함께 자주 사용된다.

```js
const fruits = ["apple", "banana", "orange"];

for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}
```

실행 결과:

```text
apple
banana
orange
```

`fruits.length`는 배열의 길이를 의미한다. 배열의 인덱스는 0부터 시작하기 때문에 `i < fruits.length` 조건을 사용한다.

## `while`문

`while`문은 조건이 참인 동안 계속 반복한다.

```js
let count = 0;

while (count < 3) {
  console.log(count);
  count++;
}
```

실행 결과:

```text
0
1
2
```

반복 횟수보다 조건 자체가 중요할 때 사용할 수 있다.

## 무한 반복 주의하기

반복문을 사용할 때는 조건이 언젠가 거짓이 되도록 만들어야 한다.

```js
let count = 0;

while (count < 3) {
  console.log(count);
  count++;
}
```

실행 결과:

```text
0
1
2
```

만약 `count++`가 없다면 `count`는 계속 0이고, 조건은 계속 참이기 때문에 반복문이 끝나지 않는다.

## `break`

`break`는 반복문을 중간에 종료할 때 사용한다.

```js
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    break;
  }

  console.log(i);
}
```

실행 결과:

```text
0
1
2
3
4
```

`i`가 5가 되는 순간 반복문이 종료된다.

## `continue`

`continue`는 현재 반복을 건너뛰고 다음 반복으로 넘어간다.

```js
for (let i = 0; i < 5; i++) {
  if (i === 2) {
    continue;
  }

  console.log(i);
}
```

실행 결과:

```text
0
1
3
4
```

`i`가 2일 때는 `console.log`가 실행되지 않는다.

## `for...of`

배열의 값을 하나씩 꺼낼 때는 `for...of`를 사용할 수 있다.

```js
const fruits = ["apple", "banana", "orange"];

for (const fruit of fruits) {
  console.log(fruit);
}
```

실행 결과:

```text
apple
banana
orange
```

인덱스가 필요 없다면 일반 `for`문보다 읽기 쉽다.

## 심화: `for`문의 여러 형태

`for`문은 기본 형태 외에도 여러 방식으로 사용할 수 있다. 반복 방향, 인덱스 사용 여부, 객체 순회 여부에 따라 적절한 형태를 선택하면 된다.

## 기본 `for`문

가장 기본적인 형태는 초기값, 조건식, 증감식을 모두 사용하는 방식이다.

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

실행 결과:

```text
0
1
2
3
4
```

반복 횟수가 명확하고 인덱스가 필요할 때 사용하기 좋다.

## 역방향 `for`문

숫자를 거꾸로 줄여가며 반복할 수도 있다.

```js
for (let i = 5; i > 0; i--) {
  console.log(i);
}
```

실행 결과:

```text
5
4
3
2
1
```

배열을 뒤에서부터 확인해야 할 때 사용할 수 있다.

```js
const fruits = ["apple", "banana", "orange"];

for (let i = fruits.length - 1; i >= 0; i--) {
  console.log(fruits[i]);
}
```

실행 결과:

```text
orange
banana
apple
```

## 증감값 바꾸기

`i++` 대신 원하는 만큼 값을 증가시킬 수 있다.

```js
for (let i = 0; i <= 10; i += 2) {
  console.log(i);
}
```

실행 결과:

```text
0
2
4
6
8
10
```

짝수처럼 일정한 간격으로 값을 다룰 때 유용하다.

## 여러 변수 사용하기

`for`문 안에서 여러 변수를 동시에 사용할 수도 있다.

```js
for (let left = 0, right = 4; left < right; left++, right--) {
  console.log(left, right);
}
```

실행 결과:

```text
0 4
1 3
```

양쪽 끝에서 가운데로 좁혀오는 로직을 만들 때 사용할 수 있다.

## 일부 생략한 `for`문

`for`문의 초기값, 조건식, 증감식은 필요에 따라 생략할 수 있다.

```js
let i = 0;

for (; i < 3; i++) {
  console.log(i);
}
```

실행 결과:

```text
0
1
2
```

초기값을 반복문 밖에서 이미 선언한 경우 이런 형태가 가능하다.

조건식도 생략할 수 있지만, 이 경우 직접 종료 조건을 만들어야 한다.

```js
let count = 0;

for (;;) {
  if (count === 3) {
    break;
  }

  console.log(count);
  count++;
}
```

실행 결과:

```text
0
1
2
```

`for (;;)`는 무한 반복을 의미한다. 반드시 `break`처럼 반복을 끝내는 코드가 있어야 한다.

## 중첩 `for`문

반복문 안에 또 다른 반복문을 넣을 수도 있다.

```js
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 2; j++) {
    console.log(`i: ${i}, j: ${j}`);
  }
}
```

실행 결과:

```text
i: 1, j: 1
i: 1, j: 2
i: 2, j: 1
i: 2, j: 2
i: 3, j: 1
i: 3, j: 2
```

중첩 반복문은 표, 좌표, 이차원 배열 같은 구조를 다룰 때 자주 나온다.

## `for...of`

`for...of`는 배열, 문자열처럼 반복 가능한 값의 요소를 하나씩 꺼낼 때 사용한다.

```js
const colors = ["red", "green", "blue"];

for (const color of colors) {
  console.log(color);
}
```

실행 결과:

```text
red
green
blue
```

문자열도 순회할 수 있다.

```js
const text = "JS";

for (const char of text) {
  console.log(char);
}
```

실행 결과:

```text
J
S
```

## `for...in`

`for...in`은 객체의 key를 순회할 때 사용한다.

```js
const user = {
  name: "Kim",
  age: 30,
  job: "developer",
};

for (const key in user) {
  console.log(key, user[key]);
}
```

실행 결과:

```text
name Kim
age 30
job developer
```

배열에는 보통 `for...in`보다 `for`, `for...of`, 배열 메서드를 사용하는 것이 더 적절하다.

## `entries()`로 인덱스와 값을 함께 사용하기

배열을 순회하면서 인덱스와 값을 모두 사용하고 싶다면 `entries()`를 사용할 수 있다.

```js
const fruits = ["apple", "banana", "orange"];

for (const [index, fruit] of fruits.entries()) {
  console.log(index, fruit);
}
```

실행 결과:

```text
0 apple
1 banana
2 orange
```

일반 `for`문보다 의도가 분명하게 보일 때가 있다.

## 반복문과 배열 메서드

배열을 다룰 때는 반복문 대신 배열 메서드를 사용할 수도 있다.

```js
const numbers = [1, 2, 3];

numbers.forEach((number) => {
  console.log(number);
});
```

실행 결과:

```text
1
2
3
```

새 배열을 만들 때는 `map`을 자주 사용한다.

```js
const numbers = [1, 2, 3];
const doubled = numbers.map((number) => number * 2);

console.log(doubled);
```

실행 결과:

```text
[2, 4, 6]
```

`for`문은 직접 흐름을 제어하기 좋고, 배열 메서드는 "무엇을 하고 싶은지"가 더 잘 드러나는 경우가 많다.

## 정리

반복문은 같은 코드를 여러 번 실행할 때 사용한다. `for`문은 반복 횟수가 명확할 때, `while`문은 조건 중심으로 반복할 때 사용한다.

다음 글에서는 코드를 재사용 가능한 단위로 묶는 함수에 대해 정리한다.
