---
title: "Rust PS 팁"
date: 2022-01-06T21:52:43+09:00
draft: false
math: true
ShowToc: true
---

# 입출력

Rust는 콘솔 입출력이 결코 편하다고 말할 수는 없는 환경입니다. 또한 잘못 짰을 경우 성능에 많은 저하가 있을 수 있기 때문에, 문제 풀이에 방해되지 않도록 빠른 입출력 방법을 찾을 필요가 있었습니다. 여기에서는 백준 15552번 빠른 A+B의 코드를 통해 여러 입출력 방식의 속도를 알아보겠습니다.

## `stdin().read_line()`

백준 언어 예시에서 보여주는, 매번 stdin 핸들을 **잠그고** 한 줄을 읽어 오는 방식입니다. `Stdin`은 내부적으로 `Mutex`를 사용하고 `Mutex::lock`은 [비싼 연산](https://github.com/MaikKlein/bench_mutex)입니다. 매번 String을 새로 만들거나 비워줘야 하는 불편함은 둘째치고 빠른 성능을 내기 어렵습니다.

{{< collapse summary="코드" >}}
```rust
use std::fmt::Write;
use std::io::stdin;
fn main() {
    let mut s = String::new();
    stdin().read_line(&mut s).unwrap();
    let t: u32 = s.trim_end().parse().unwrap();
    let mut output = String::new();
    for _ in 0..t {
        s.clear();
        stdin().read_line(&mut s).unwrap();
        let sum: u32 = s
            .trim_end()
            .split(' ')
            .map(str::parse::<u32>)
            .flatten()
            .sum();
        writeln!(output, "{}", sum).unwrap();
    }
    print!("{}", output);
}
```
{{< /collapse >}} 

```rust
Benchmark 1: ./read_line < sum.in
  Time (mean ± σ):     130.2 ms ±  15.6 ms    [User: 126.2 ms, System: 4.0 ms]
  Range (min … max):   111.3 ms … 171.7 ms    25 runs
```

<embed alt="read_line을 사용했을 때의 flamegraph" src="read_line.svg" width="100%" type="image/svg+xml">

lock을 미리 해 주면 성능이 올라가지만, read_until이 꽤 시간을 잡아먹는 것을 볼 수 있습니다.

{{< collapse summary="코드" >}}
```rust
use std::fmt::Write;
use std::io::{stdin, BufRead};
fn main() {
    let mut s = String::new();
    let stdin = stdin();
    let mut lock = stdin.lock();
    lock.read_line(&mut s).unwrap();
    let t: u32 = s.trim_end().parse().unwrap();
    let mut output = String::new();
    for _ in 0..t {
        s.clear();
        lock.read_line(&mut s).unwrap();
        let sum: u32 = s
            .trim_end()
            .split(' ')
            .map(str::parse::<u32>)
            .flatten()
            .sum();
        writeln!(output, "{}", sum).unwrap();
    }
    print!("{}", output);
}
```
{{< /collapse >}}

```rust
Benchmark 2: ./read_line_lock < sum.in
  Time (mean ± σ):     122.2 ms ±  15.9 ms    [User: 117.8 ms, System: 4.6 ms]
  Range (min … max):   100.1 ms … 146.4 ms    20 runs
```

<embed alt="Stdin::lock과 read_line을 사용했을 때의 flamegraph" src="read_line_lock.svg" width="100%" type="image/svg+xml">

## `lines()`

String을 초기화할 귀찮음 없이 쓸 수 있는 방법으로 `lines()`가 있습니다. 이 메서드는 `StdinLock`을 요구하므로 (`Stdin::lines`는 experimental) lock을 여러 번 하지 않는다는 장점도 있습니다. 그럼 과연 빨라질까요?

{{< collapse summary="코드" >}}
```rust
use std::fmt::Write;
use std::io::{stdin, BufRead};
fn main() {
    let stdin = stdin();
    let mut lines = stdin.lock().lines().flatten();
    let t: u32 = lines.next().unwrap().parse().unwrap();
    let mut output = String::new();
    for _ in 0..t {
        let line = lines.next().unwrap();
        let sum: u32 = line.split(' ').map(str::parse::<u32>).flatten().sum();
        writeln!(output, "{}", sum).unwrap();
    }
    print!("{}", output);
}
```
{{< /collapse >}}

```rust
Benchmark 3: ./lines < sum.in
  Time (mean ± σ):     172.1 ms ±  18.2 ms    [User: 167.6 ms, System: 4.5 ms]
  Range (min … max):   144.2 ms … 202.5 ms    15 runs
```

오히려 더 느려졌습니다! 이는 매 줄마다 새로운 String을 할당하기 때문입니다. flamegraph에서 힙 할당과 관련한 부분이 길게 나타나는 것을 볼 수 있습니다.

<embed alt="lines를 사용했을 때의 flamegraph" src="lines.svg" width="100%" type="image/svg+xml">

## `read_to_string()`

위 세 가지 방법 모두 (출력을 제외하면) 같은 부분에서 성능 저하가 있습니다. 바로 `read_until`입니다. 이 부분을 제거하기 위해서 모든 입력 내용을 한 번에 받아오는 방법을 떠올릴 수 있습니다. 코드도 간결합니다.

{{< collapse summary="코드" >}}
```rust
use std::fmt::Write;
use std::io::{stdin, Read};
fn main() {
    let mut buffer = String::new();
    stdin().read_to_string(&mut buffer).unwrap();
    let mut input = buffer.split_ascii_whitespace();
    let t: u32 = input.next().unwrap().parse().unwrap();
    let mut output = String::new();
    let mut nums = input.map(str::parse::<u32>).flatten();
    for _ in 0..t {
        let sum: u32 = nums.by_ref().take(2).sum();
        writeln!(output, "{}", sum).unwrap();
    }
    print!("{}", output);
}
```
{{< /collapse >}}

```rust
Benchmark 4: ./read_all < sum.in
  Time (mean ± σ):      82.9 ms ±  10.3 ms    [User: 74.6 ms, System: 8.3 ms]
  Range (min … max):    60.5 ms … 100.0 ms    38 runs
```

<embed alt="read_to_string을 사용했을 때의 flamegraph" src="read_all.svg" width="100%" type="image/svg+xml">

입력과 같이 출력 또한 한 번에 몰아서 하는 것이 좋습니다. 위쪽 벤치마크 코드에서 `writeln` 부분이 `output`에 모든 출력을 몰아두고, 마지막에만 `println`을 하는 모습을 보실 수 있죠. `writeln`은 `println`과 사용법이 같고, 맨 처음 인자로 버퍼가 들어간다는 점만 다릅니다. 참고로 `read_to_string()` 코드를 `println`만 사용하여 짜면 이렇게 됩니다.

{{< collapse summary="코드" >}}
```rust
use std::io::{stdin, Read};
fn main() {
    let mut buffer = String::new();
    stdin().read_to_string(&mut buffer).unwrap();
    let mut input = buffer.split_ascii_whitespace();
    let t: u32 = input.next().unwrap().parse().unwrap();
    let mut nums = input.map(str::parse::<u32>).flatten();
    for _ in 0..t {
        let sum: u32 = nums.by_ref().take(2).sum();
        println!("{}", sum);
    }
}
```
{{< /collapse >}}

```rust
Benchmark 1: ./println < sum.in
  Time (mean ± σ):     343.7 ms ±  30.5 ms    [User: 184.2 ms, System: 159.3 ms]
  Range (min … max):   299.5 ms … 386.7 ms    10 runs
```

<embed alt="println을 사용했을 때의 flamegraph" src="println.svg" width="100%" type="image/svg+xml">

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