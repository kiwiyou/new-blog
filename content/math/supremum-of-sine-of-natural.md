---
title: "자연수의 사인값의 상한"
date: 2022-01-07T16:02:58+09:00
draft: false
math: true
---

다음과 같은 집합을 생각해 봅니다.

$$A = \left\\{ \sin(n) | n \in \N \right\\}$$

$\sup(A)$는 1일까요?

$$B = \left\\{ \sin(q) | q \in \mathbb{Q} \right\\}$$
$$\sup(B) = 1$$

유리수의 경우에는 $\pi/2$에 충분히 가까운 유리수를 잡을 수 있기에 직관적으로 위 명제가 성립합니다.

자연수는 그렇지 못하여 다른 접근 방식이 필요했습니다.

# $\sin(n)$이 1에 충분히 가까운 $n$의 존재성

$\sin(n)$이 1에 충분히 가깝다는 것은 작은 임의의 양수 $\epsilon$에 대해

$$1 - \epsilon \lt \sin(n) \lt 1 + \epsilon$$
$$\sin^{-1}(1 - \epsilon) \lt n \lt \sin^{-1}(1 + \epsilon)$$
$$(4m + 1)\pi/2 - \epsilon' \lt n \lt (4m + 1)\pi/2 + \epsilon'$$

즉 $(4m + 1)\pi/2$에 충분히 가까운 자연수 $n$을 찾을 수 있는지의 문제로 귀결됩니다.

# 역발상

위에서는 자연수 $n$을 구간 $((4m + 1)\pi/2 - \epsilon', (4m + 1)\pi/2 + \epsilon')$에 맞추려 했다면, 이번엔 역으로 $(4m + 1)\pi/2$를 $(n, n + 1)$에 맞추려 해봤습니다.

$\\{x\\} =$ $x$의 소수 부분, $f(n) = (4n + 1)\pi/2$라 두겠습니다.

$$
\exists p, q \in \Z^+ (p \neq q) \\\\
\\{f(p)\\} = \\{f(q)\\} \\\\
\Rightarrow f(p) - \lfloor f(p) \rfloor = f(q) - \lfloor f(q) \rfloor \\\\
\Rightarrow 2(p - q)\pi = \lfloor f(p) \rfloor - \lfloor f(q) \rfloor
$$

귀류법으로 모든 $f(n)$이 서로 다름을 보였습니다.

이때 구간 $[0, 1)$을 크기가 $1/n$인 $n$개의 구간으로 나누면, $n + 1$개의 $f(k)$를 선택했을 때 반드시 한 구간에 둘 이상의 $f(k)$가 들어갑니다. 즉

$$
\exists p, q (p \neq q) \\\\
0 \lt |\\{f(p)\\} - \\{f(q)\\}| \lt \frac{1}{n}
$$

$M \left|\\{f(p)\\} - \\{f(q)\\}\right| \leq 1$인 최대의 $M$을 잡으면

$$
\forall i \in \\{0, 1, \cdots, n-1\\}\ \exists m \in \\{1, 2, \cdots, M\\} \\\\
m \left|\\{f(p)\\} - \\{f(q)\\} \right| \in \left[\frac{i}{n}, \frac{i + 1}{n} \right]
$$

$m\left|\\{f(p)\\} - \\{f(q)\\}\right| = \\{2\pi m|p - q|\\}$이므로

$$\left\\{2\pi m|p - q| + \frac{\pi}{2}\right\\} = \\{f(m|p-q|)\\} \in \left[\frac{i}{n}, \frac{i + 1}{n}\right] \cap [0, 1)$$

이제 충분히 큰 $n$에 대해
$(4m\pi + 1) / 2 \lt \lfloor(4m\pi + 1)/2\rfloor + 1/n$인 $m$을 잡을 수 있으므로, 수열 $\\{a_i\\}$를 $n = i$일 때 $\lfloor(4m\pi + 1)/2\rfloor$로 두면

$$\lim_{n\to\infty}\sin(a_n)=1$$

따라서 $\sup(\sin(\N)) = 1$입니다.

## 참고

풀이에 [이곳](https://math.stackexchange.com/a/272713)을 많이 참고했습니다.
