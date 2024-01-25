---
author: kiwiyou
pubDatetime: 2024-01-25T03:08:15.595Z
title: Rust 빠른 입출력
slug: rust-fastio
featured: false
draft: false
tags:
  - 문제 해결
  - 최적화
description: 문제 해결을 위해 Rust에서 빠르고 쉽게 입력받는 방법을 알아봅니다.
comment: true
---

Rust로 문제 해결을 할 때 입출력은 항상 고민이 됩니다.
`std::io::stdin()`을 매번 호출하면 락으로 인한 속도 저하가 발생하고,
`StdinLock::read_line`을 매번 호출하기에는 입력이 줄로 구분되지 않고 공백으로 구분될 경우에 처리가 불편합니다.
여기서는 제가 주로 쓰는 템플릿을 소개하고자 합니다.

```rust
fn solve(stdin: &str) {
    let mut tokens = stdin.split_whitespace();
    let mut next = || tokens.next().unwrap();
    let t = next().parse().unwrap();
    for _ in 0..t {
        let a: i32 = next().parse().unwrap();
        let b: i32 = next().parse().unwrap();
        println!("{}", a + b);
    }
}

fn main() {
    use std::io::*;
    solve(&read_to_string(stdin()).unwrap());
    STDOUT.with(|refcell| std::io::Write::flush(&mut *refcell.borrow_mut()).unwrap());
}

thread_local! {
    static STDOUT: std::cell::RefCell<std::io::BufWriter<std::io::StdoutLock<'static>>> = std::cell::RefCell::new(
std::io::BufWriter::with_capacity(1 << 17, std::io::stdout().lock()));
}

#[macro_export]
macro_rules! println {
    ($($t:tt)*) => {
        STDOUT.with(|refcell| {
            use std::io::*;
            writeln!(refcell.borrow_mut(), $($t)*).unwrap();
        });
    };
}
#[macro_export]
macro_rules! print {
    ($($t:tt)*) => {
        STDOUT.with(|refcell| {
            use std::io::*;
            write!(refcell.borrow_mut(), $($t)*).unwrap();
        });
    };
}
```

우선 `main`을 살펴보면, 입력 전체를 받아 `solve` 함수에 넘겨주고 있습니다.
`solve` 함수에서는 받은 입력을 공백 및 개행 기준으로 나눕니다. (`split_whitespace`)
그리고 편의 클로저 `next`를 정의하는데, 이는 공백 및 개행으로 구분된 다음 문자열을 가져오는 역할을 합니다.
문제 해결 분야에서 보통 값이 공백 혹은 개행으로 구분되어 주어지기 때문에 이런 형식을 채택했습니다.
`solve` 함수가 종료되면 `STDOUT`을 flush해 줍니다.

아래의 매크로 부분은 `println` 및 `print`를 고속화하기 위한 장치입니다.
Thread Local 변수인 `STDOUT`에 표준 출력을 연결한 `BufWriter`를 배정합니다.
`BufWriter`의 용량인 `1 << 17`은 경험적으로 얻은 최적 크기입니다.

다음으로 `println`과 `print`가 `STDOUT`에 출력하도록 매크로를 재정의해줍니다.
`LocalKey<RefCell>`에 `with_borrow_mut`이 존재하지만 많은 환경에서 지원하지 않아 풀어서 썼습니다.

Rust로 문제 해결 시에 다양한 입출력 인터페이스를 구상하고 만들어 봤지만, 이 인터페이스가 가장 간단하고 쓰기 편한 것 같습니다.
이 템플릿이 아무쪼록 편안한 문제 해결에 도움이 되길 바랍니다.
읽어주셔서 감사합니다.