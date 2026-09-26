---
author: kiwiyou
pubDatetime: 2024-06-29T16:37:41.971Z
title: Javascript Fast Deque
slug: js-deque
featured: false
draft: false
tags:
  - 최적화
description: 연결 리스트를 사용하지 않는 빠른 JS 환형 큐
comment: true
math: true
---

JS는 내장 큐/덱이 없습니다. 대부분은 라이브러리를 사용하겠지만, 구현해야 할 경우도 어디에 있겠죠.
일반적으로 덱을 구현할 때 Array를 사용하면 삽입 및 삭제에 $\mathcal{O}(N)$, 연결 리스트를 사용하면 삽입 및 삭제에 $\mathcal{O}(1)$이 걸린다고 알려져 있습니다.
때문에 연결 리스트 구현이 잘 알려져 있는 것 같습니다.
다만 연결 리스트는 컴퓨터 친화적이지 않아 속도가 실용적이지 않을 때가 있습니다.
이때 Array를 사용하되 삽입 밎 삭제에 분할 상환<sup>amortized</sup>$\mathcal{O}(1)$이 걸리는 덱의 구현을 소개합니다.
설명은 코드 아래를 참고해 주세요.

Here is the code:

```js
class Deque {
  constructor() {
    this.buf = [,]
    this.front = 0
    this.back = 0
  }
  length() {
    const len = this.back - this.front
    return len < 0 ? len + this.buf.length : len
  }
  isEmpty() {
    return this.front === this.back
  }
  double() {
    const length = this.buf.length << 1
    if (this.back < this.front) {
      const buf = this.buf.slice(this.front)
      for (let i = 0; i < this.back; ++i) buf.push(this.buf[i])
      this.buf = buf
    }
    this.buf.length = length
    this.front = 0
    this.back = (length >> 1) - 1
  }
  push(v) {
    let back = this.back + 1
    if (back === this.buf.length) back = 0
    if (back === this.front) this.double()
    this.buf[this.back++] = v
    if (this.back === this.buf.length) this.back = 0
  }
  pop() {
    if (--this.back < 0) this.back += this.buf.length
    return this.buf[this.back]
  }
  shift() {
    const v = this.buf[this.front++]
    if (this.front === this.buf.length) this.front = 0
    return v
  }
  unshift(v) {
    let front = this.front - 1
    if (front < 0) front += this.buf.length
    if (front === this.back) this.double()
    if (--this.front < 0) this.front += this.buf.length
    this.buf[this.front] = v
  }
}
```

## 설명

큐의 크기가 고정되어 있다면 환형 큐<sup>circular queue</sup>를 쉽게 구현하여 삽입, 삭제에 $\mathcal{O}(1)$이 걸리게 할 수 있습니다.
배열에서 큐의 맨 앞, 맨 뒤를 나타내는 인덱스를 저장하여 이를 앞뒤로 움직이며 자료를 저장하죠.

문제는 길이를 미리 알지 못하는 경우입니다.
이때는 길이가 어느 수준에 도달하면 큐의 크기를 키울 필요가 있는데, 값의 복사가 일어나므로 삽입에 $\mathcal{O}(N)$이 걸리기 쉽습니다.
큐의 크기를 항상 $2$의 거듭제곱으로 유지하면, 큐의 크기가 $2^K$에 도달하기 위해 일어난 값의 복사가 $2^K - 1$회가 됩니다.
큐의 크기를 $N$으로 두면, 값의 복사가 $\mathcal{O}(N)$번 일어나는 것이죠.
삽입이 $\mathcal{O}(N)$번 일어났을 때 값의 복사가 $\mathcal{O}(N)$번 일어나므로, 값의 복사는 삽입 한 번당 $\mathcal{O}(1)$만큼 일어난다고 볼 수 있습니다.
이러한 시간복잡도 분석 방법을 분할 상환 분석<sup>Amortized Analysis</sup>이라고 합니다.

배열을 늘릴 때 점차 크게 늘리며 삽입의 시간복잡도를 분할 상환 $\mathcal{O}(1)$로 유지하는 이 방법은 사실 대부분의 가변 길이 배열에서 사용되는 방식입니다.

도움이 되셨으면 좋겠습니다. 오류나 누락된 설명, 질문 등은 댓글 혹은 [kiwiyou@kiwiyou.dev](mailto:kiwiyou@kiwiyou.dev)로 부탁드립니다. 감사합니다.
