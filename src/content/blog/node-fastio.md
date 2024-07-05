---
author: kiwiyou
pubDatetime: 2024-07-05T09:10:14.776Z
title: NodeJS 빠른 입출력
slug: node-fastio
featured: false
draft: false
tags:
  - 문제 해결
  - 최적화
description: 문제 해결을 위해 NodeJS에서 빠르고 쉽게 입력받는 방법을 알아봅니다.
comment: true
---

문자열을 공백 기준으로 나눠주는 IO 방식인데, V8이 문자열의 slice를 특수 처리하기 때문에 성능 향상을 보일 수 있다.

## 사용법
```js
// 입력: kiwiyou 123
const io = new IO();
const a = io.token();
const b = io.number();
io.print(a);
io.byte(10);
io.print(b);
// 출력:
// kiwiyou
// 123
```

## 코드
```js
function IO() {
  const { readFileSync, writeSync } = require('node:fs');
  const stdin = readFileSync(0);
  const text = stdin.toString('ascii');
  let buffer = "";
  process.on('exit', () => this.flush());
  let i = 0;
  this.white = () => {
    while (stdin[i] <= 32) i++;
  };
  this.token = () => {
    this.white();
    const s = i;
    while (stdin[i] > 32) i++;
    return text.slice(s, i);
  }
  this.number = () => {
    return this.token() | 0;
  };
  this.print = (v) => {
    buffer += v;
    if (buffer.length > 1 << 19) this.flush();
  }
  this.flush = () => {
    writeSync(1, buffer, 'ascii');
    buffer = "";
  }
  return this;
}
```