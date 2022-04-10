---
title: "Rust PS 팁"
date: 2022-01-06T21:52:43+09:00
draft: false
math: true
ShowToc: true
comments: true
---

> 2022-04-10 수정: 속도 비교 내용을 제거하고 입출력 방법에 대한 서술을 늘렸습니다.

# 입출력

Rust는 콘솔 입출력이 결코 편하다고 말할 수는 없는 환경입니다.
또한 잘못 짰을 경우 성능에 많은 저하가 있을 수 있기 때문에,
문제 풀이에 방해되지 않도록 빠른 입출력 방법을 찾을 필요가 있었습니다.

## Rust 입출력의 속도 저하

다음은 백준 Rust 예시에서 보여주는 코드입니다.
이 코드 그대로 문제 풀이를 진행한다면 많은 문제에서 시간 초과를 받을 수 있습니다.

```rust
use std::io;

fn main() {
    let mut s = String::new();

    io::stdin().read_line(&mut s).unwrap();

    let values:Vec<i32> = s
        .as_mut_str()
        .split_whitespace()
        .map(|s| s.parse().unwrap())
        .collect();

    println!("{}", values[0] + values[1]);
}
```

이유는 `io::stdin()`의 내부 구현과 `println!`의 내부 구현 때문입니다.
`io::stdin()`과 `println!`은 표준 입출력 핸들을 `Mutex`를 통해 잠그고 사용하는데, 
`Mutex`를 잠그는 연산은 [오랜 시간이 걸리기](https://github.com/MaikKlein/bench_mutex) 때문에
시간 초과를 받을 수 있습니다. 저는 아래와 같은 방식을 추천합니다.

## 한 번에 입력받고 한 번에 출력하기

입력을 한 곳에 모아서 받고, 출력 또한 내용을 한 곳에 모은 뒤 한꺼번에 한다면 속도를 향상시킬 수 있습니다.

입력을 한 곳에 모으는 방법은 다음과 같습니다.

```rust
let mut input = String::new();
io::stdin().read_to_string(&mut input).unwrap();
```

모든 입력이 `input` 변수 안에 들어가므로, `&str`의 메소드를 사용해 입력을 원하는 형식으로 변환할 수 있습니다.

`str::split_ascii_whitespace`는 문자열을 스페이스, 엔터 등 ASCII 공백을 기준으로 나누는 반복자를 반환하고,
`str::parse` 메소드는 문자열을 `FromStr`을 구현하는 타입으로 변환하는 역할을 합니다.

이 둘을 적절히 조합해서, 다음과 같이 쓸 수 있습니다.

```rust
let mut tokens = input.split_ascii_whitespace();
let token = tokens.next().unwrap();
let number: i32 = token.parse().unwrap();
```

위 코드는 공백으로 분리된 수 하나를 `i32` 형식으로 변환하는 코드입니다.
매번 `token` 변수를 생성하는 것은 귀찮기에, 이렇게 쓸 수도 있습니다.

```rust
let number: i32 = tokens.next().unwrap().parse().unwrap();
```

만약 입력받을 수의 타입이 모두 같다면, 반복자를 활용해서 다음과 같이 쓸 수 있습니다.

```rust
let mut numbers = input.split_ascii_whitespace().map(str::parse).flatten();
let a: usize = numbers.next().unwrap();
let b = numbers.next().unwrap();
let c = numbers.next().unwrap();
```

`a` 변수의 타입을 지정함으로써 모든 공백으로 분리된 수를 `usize` 타입으로 변환하도록 만들었습니다.
이로 인해 `numbers`는 `usize`를 반환하는 반복자가 되고,
`next`를 통해 `usize` 타입의 값을 계속 받아올 수 있습니다.

반복자를 이용하면 `Vec` 또한 만들 수 있습니다.

```rust
let n = numbers.next().unwrap();
let my_vec: Vec<usize> = numbers.by_ref().take(n).collect();
```

한편 출력은 입력보다 간단합니다.
`println!` 대신 `writeln!`을 쓰되, 프로그램 종료 직전에 `print!`를 해 주면 됩니다.

```rust
// writeln!을 쓰기 위해 필요합니다.
use std::fmt::Write;

let mut output = String::new();

writeln!(output, "{} + {} = {}", 1, 2, 1 + 2).unwrap();

// 프로그램 마지막에 한 번만 실행해주세요.
print!("{}", output);
```

`writeln!`을 이용한 출력은 모두 `output` 변수에 문자열 형태로 저장되고,
프로그램 종료 직전에 모든 출력 내용이 한 번에 콘솔로 복사됩니다.

마지막으로 [백준 15552번 빠른 A+B](https://www.acmicpc.net/problem/15552)의 코드를 통해
위 내용이 어떻게 적용되는지 감을 잡으실 수 있기를 바랍니다.

```rust
use std::fmt::Write;
use std::io::{stdin, Read};

fn main() {
    let mut input = String::new();
    stdin().read_to_string(&mut input).unwrap();
    let mut input = input.split_ascii_whitespace().map(str::parse).flatten();
    let mut output = String::new();
    let t: usize = input.next().unwrap();
    for _ in 0..t {
        let a = input.next().unwrap();
        let b = input.next().unwrap();
        writeln!(output, "{}", a + b).unwrap();
    }
    print!("{}", output);
}
```

# 알아두면 좋은 표준 라이브러리 기능

## 반복자(Iterator)

일반 배열이 아닌 `Vec`이나 slice(`[T]`)를 사용할 경우 인덱스로 값에 접근할 때 범위 확인이 일어납니다. 입력 크기가 클 때 반복자를 사용하면 시간을 줄일 수 있습니다.

반복자는 일반적으로 `iter()` 메소드로 얻을 수 있고, `for`에서 반복할 대상으로 쓸 수 있습니다.

```rust
let list = vec![1, 5, 2, 3];
for number in list.iter() {
    if *number % 2 == 1 {
        println!("{}은(는) 홀수입니다", number);
    }
}
// 출력
// 1은(는) 홀수입니다
// 5은(는) 홀수입니다
// 3은(는) 홀수입니다
```

### `enumerate()`

반복의 횟수를 알고 싶을 때 사용합니다. 0부터 시작해서 반복 시마다 1씩 증가하는 카운터를 추가한 튜플을 반환하도록 반복자를 변경합니다.

```rust
for (i, number) in list.iter().enumerate() {
    println!("{}번째 수는 {}입니다", i + 1, number);
}
// 1번째 수는 1입니다
// 2번째 수는 5입니다
// 3번째 수는 2입니다
// 4번째 수는 3입니다
```

### `sum()`, `product()`, `max()`, `min()`

각각 반복자 내의 값의 합, 곱, 최대, 최소를 구합니다.

```rust
println!(
    "{} {} {} {}",
    list.iter().sum::<i32>(),
    list.iter().product::<i32>(),
    list.iter().max::<i32>(),
    list.iter().min::<i32>(),
);
// 11 30 5 1
```

## 이분 탐색

이분 탐색은 무슨 자료구조를 사용하는지에 따라 이름이 약간 다릅니다.

- [`Vec::binary_search`](https://doc.rust-lang.org/std/primitive.slice.html#method.binary_search), [`Vec::partition_point`](https://doc.rust-lang.org/std/primitive.slice.html#method.partition_point)

`Vec<T>`의 `binary_search`는 특정 값의 위치를 반환하되, 찾지 못한 경우 그 값을 삽입할 수 있는 위치를 반환합니다. 가능한 위치가 여럿이라면 그 중 임의로 하나를 반환합니다.

```rust
let list = vec![1, 6, 6, 8, 9];
assert_eq!(Ok(3), list.binary_search(&8));
assert_eq!(Err(5), list.binary_search(&10));
```

값의 존재 유무가 상관 없는 경우, 두 위치가 모두 필요한 경우에는 `Result`의 기능 부족으로 코드가 약간 복잡해지는데, 이때 `partition_point`를 사용할 수 있습니다. `partition_point`는 특정한 위치를 기준으로 `Vec`의 왼쪽 원소에 대해서는 `pred`가 `true`를 반환하고, 오른쪽 원소에 대해서는 `pred`가 `false`를 반환할 때, 오른쪽 첫 번째 원소의 인덱스를 반환하는 메서드입니다. `pred`의 지정 방식에 따라 C++의 `lower_bound`, `upper_bound`처럼 기능하는 함수입니다.

```rust
let list = vec![1, 6, 6, 8, 9];
assert_eq!(1, list.partition_point(|&x| x < 6));
assert_eq!(3, list.partition_point(|&x| x <= 6));

let list = vec![3, 5, 7, 2, 0];
assert_eq!(3, list.partition_point(|&x| x % 2 == 1));
```

- `BTreeSet::range`, `BTreeMap::range`

`BTreeSet`과 `BTreeMap`은 키를 기준으로 정렬되어 있기 때문에 키가 특정 범위 내에 있는 데이터를 순회할 수 있는 반복자(iterator)를 $O(\log n)$에 얻을 수 있습니다. 

```rust
let mut list = BTreeSet::new();
list.insert(7);
list.insert(9);
list.insert(3);
list.insert(5);
list.insert(6);

assert!(list.range(4..9).eq(&[5, 6, 7]));
assert!(list.range(4..=9).eq(&[5, 6, 7, 9]));

use std::ops::Bound::*;
assert!(list.range((Included(3), Excluded(5))).eq(&[3]));
assert!(list.range((Excluded(3), Included(5))).eq(&[5]));
assert!(list.range((Excluded(3), Unbounded)).eq(&[5, 6, 7, 9]));
```
