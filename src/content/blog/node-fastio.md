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

문자열을 공백 기준으로 나눠주는 IO 방식인데, V8이 문자열의 slice를 특수 처리하기 때문에 asmjs와 함께 사용하면 매우 큰 성능 향상을 보일 수 있다.

기존에 입력을 정규식으로 split하던 FastIO로 BOJ 18352번에서 1268ms이던 코드가 해당 Reader을 적용한 후 524ms가 되었다.

## 사용법
```js
// 입력: kiwiyou 123
const reader = new Reader();
const a = reader.token(); // "kiwiyou"
const b = reader.number(); // 123
```

## 코드
```js
function Reader() {
  const heap = require('node:buffer').Buffer.allocUnsafe(1 << 24);
  const len = require('node:fs').readSync(0, heap);
  const text = heap.subarray(0, len).toString('ascii');
  const io = new BytesIO({ Uint8Array }, {}, heap.buffer);
  io.init(len);
  this.token = () => {
    const s = io.start();
    const e = io.end();
    return text.slice(s, e);
  };
  this.number = () => {
    return this.token() | 0;
  }
  return this;
}
function BytesIO(stdlib, foreign, heap) {
  'use asm';
  var b = new stdlib.Uint8Array(heap), i = 0, e = 0;
  function init(len) {
    len = len | 0;
    e = len | 0;
  }
  function start() {
    while ((i | 0) < (e | 0)) {
      if ((b[i | 0] | 0) > 32) break;
      i = (i + 1) | 0;
    }
    return i | 0;
  }
  function end() {
    while ((i | 0) < (e | 0)) {
      if ((b[i | 0] | 0) <= 32) break;
      i = (i + 1) | 0;
    }
    return i | 0;
  }
  return {
    init: init,
    start: start,
    end: end,
  }
}
```