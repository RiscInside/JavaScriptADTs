# Symbolic differentiation benchmark

A simple symbolic differentiation benchmark. Function `diff` is called with a single argument - expression to differentiate. 4 kinds of expressions are supported

* Number
* Variable we are differentiating against
* Sum of two expressions
* Product of two expressions

## Equivalent Haskell ADT

```hs
data Expr = Number Double | Var | Sum Expr Expr | Product Expr Expr
```

## Benchmark operation

Differentiation function is defined as follows
```hs
diff (Number _) = Number 0
diff Var = Number 1
diff (Sum e1 e2) = Sum (diff e1) (diff e2)
diff (Product e1 e2) = Sum (Product (diff e1) e2) (Product (diff e2) e1)
```

The tree of depth n is generated as follows

```hs
ofDepth 0 = Var
ofDepth n = Product tree tree
  where
    tree = ofDepth (n - 1)
```

Symbolic simplification function is defined as follows
```hs
simplify (Add e1 e2) =
  case (e1', e2') of
    (Number n1, Number n2) -> Number (n1 + n2)
    (Number 0, _) -> e2'
    (_, Number 0) -> e1'
    (_ , _) -> Add e1' e2'
  where
    e1' = simplify e1
    e2' = simplify e2
simplify (Mul e1 e2) =
  case (e1', e2')  of
    (Number n1, Number n2) -> Number (n1 * n2)
    (Number 0, _) -> 0
    (Number 1, _) -> e2'
    (_, Number 0) -> 0
    (_, Number 1) -> e1'
    (_, _) -> Mul e1' e2'
simplify e = e
```

For this benchmark, a tree of depth 4 is generated. This tree is then differentiated 4 times. The result is then simplified. This process runs 1000 times.

## Participants

|            Filename             |     Equivalent of `Number n`     |          Equivalent of `Var`             |   Equivalent of `Add e1 e2`  |   Equivalent of `Mul e1 e2`  |
|---------------------------------|----------------------------------|------------------------------------------|------------------------------|------------------------------|
|      `array-tag-inline.js`      |             `[0, n]`             |                  `[1]`                   |        `[2, e1, e2]`         |         `[3 e2, e2]`         |
|`fields-same-shape-undef-fill.js`| `{tag: 0, n1: n, n2: undefined}` | `{tag: 1, n1: undefined, n2: undefined}` |  `{tag: 2, n1: e1, n2: e2}`  |  `{tag: 3, n1: e1, n2: e2}`  |
|  `fields-same-shape-0-fill.js`  |     `{tag: 0, n1: n, n2: 0}`     |         `{tag: 1, n1: 0, n2: 0}`         |  `{tag: 2, n1: e1, n2: e2}`  |  `{tag: 3, n1: e1, n2: e2}`  |
|          `fields.js`            |       `{tag: 0, val: n}`         |               `{tag: 1}`                 | `{tag: 2, lhs: e1, rhs: e2}` | `{tag: 3, lhs: e1, rhs: e2}` |
|      `numbered-fields.js`       |       `{tag: 0, [0]: n}`         |               `{tag: 1}`                 | `{tag: 2, [0]: e1, [1]: e2}` | `{tag: 3, [0]: e1, [1]: e2}` |

## Results on my PC

### NodeJS (v18.13.0)

```
Benchmark 1: node arrays-tag-inline.js
  Time (mean ± σ):     425.4 ms ±  14.3 ms    [User: 418.0 ms, System: 20.5 ms]
  Range (min … max):   409.6 ms … 450.7 ms    10 runs
 
Benchmark 2: node fields-same-shape-0-fill.js
  Time (mean ± σ):     499.4 ms ±   8.2 ms    [User: 493.9 ms, System: 22.5 ms]
  Range (min … max):   489.6 ms … 511.4 ms    10 runs
 
Benchmark 3: node fields-same-shape-undef-fill.js
  Time (mean ± σ):     504.9 ms ±   8.6 ms    [User: 501.9 ms, System: 21.1 ms]
  Range (min … max):   494.8 ms … 518.4 ms    10 runs
 
Benchmark 4: node fields.js
  Time (mean ± σ):     432.9 ms ±  17.4 ms    [User: 448.1 ms, System: 23.1 ms]
  Range (min … max):   410.6 ms … 465.8 ms    10 runs
 
Benchmark 5: node numbered-fields.js
  Time (mean ± σ):      4.399 s ±  0.047 s    [User: 4.856 s, System: 0.036 s]
  Range (min … max):    4.332 s …  4.479 s    10 runs
 
Summary
  'node arrays-tag-inline.js' ran
    1.02 ± 0.05 times faster than 'node fields.js'
    1.17 ± 0.04 times faster than 'node fields-same-shape-0-fill.js'
    1.19 ± 0.04 times faster than 'node fields-same-shape-undef-fill.js'
   10.34 ± 0.36 times faster than 'node numbered-fields.js'
```

### JSC

```
Benchmark 1: jsc arrays-tag-inline.js
  Time (mean ± σ):     468.6 ms ±  89.2 ms    [User: 542.1 ms, System: 59.0 ms]
  Range (min … max):   325.3 ms … 545.9 ms    10 runs
 
Benchmark 2: jsc fields-same-shape-0-fill.js
  Time (mean ± σ):     410.6 ms ±   9.9 ms    [User: 461.0 ms, System: 84.0 ms]
  Range (min … max):   397.0 ms … 424.0 ms    10 runs
 
Benchmark 3: jsc fields-same-shape-undef-fill.js
  Time (mean ± σ):     411.5 ms ±  12.3 ms    [User: 458.4 ms, System: 86.8 ms]
  Range (min … max):   389.4 ms … 431.4 ms    10 runs
 
Benchmark 4: jsc fields.js
  Time (mean ± σ):     357.6 ms ±   8.6 ms    [User: 388.8 ms, System: 86.2 ms]
  Range (min … max):   342.6 ms … 369.9 ms    10 runs
 
Benchmark 5: jsc numbered-fields.js
  Time (mean ± σ):      1.926 s ±  0.039 s    [User: 2.101 s, System: 0.129 s]
  Range (min … max):    1.854 s …  1.974 s    10 runs
 
Summary
  'jsc fields.js' ran
    1.15 ± 0.04 times faster than 'jsc fields-same-shape-0-fill.js'
    1.15 ± 0.04 times faster than 'jsc fields-same-shape-undef-fill.js'
    1.31 ± 0.25 times faster than 'jsc arrays-tag-inline.js'
    5.38 ± 0.17 times faster than 'jsc numbered-fields.js'
```
