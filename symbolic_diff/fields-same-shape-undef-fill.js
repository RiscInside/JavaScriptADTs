function diff(e) {
    switch (e.tag) {
        case 0:
            return { tag: 0, f1: 0, f2: undefined };
        case 1:
            return { tag: 0, f1: 1, f2: undefined };
        case 2:
            return { tag: 2, f1: diff(e.f1), f2: diff(e.f2) };
        case 3:
            return {
                tag: 2,
                f1: { tag: 3, f1: diff(e.f1), f2: e.f2 },
                f2: { tag: 3, f1: e.f1, f2: diff(e.f2) }
            };
    }
    throw "oops";
}

function simplify(e) {
    switch (e.tag) {
        case 0:
            return e;
        case 1:
            return e;
        case 2: {
            let e1 = simplify(e.f1);
            let e2 = simplify(e.f2);
            if (e1.tag == 0 && e2.tag == 0) {
                return { tag: 0, f1: e1.f1 + e2.f1, f2: undefined };
            } else if (e1.tag == 0 && e1.f1 == 0) {
                return e2;
            } else if (e2.tag == 0 && e2.f1 == 0) {
                return e1;
            }
            return { tag: 2, f1: e1, f2: e2 };
        }
        case 3: {
            let e1 = simplify(e.f1);
            let e2 = simplify(e.f2);
            if (e1.tag == 0 && e2.tag == 0) {
                return { tag: 0, f1: e1[1] * e2[1], f2: undefined };
            } else if (e1.tag == 0) {
                if (e1.f1 == 0) {
                    return { tag: 0, f1: 0, f2: undefined };
                } else if (e1.f1 == 1) {
                    return e2;
                }
            } else if (e2.tag == 0) {
                if (e2.f1 == 0) {
                    return { tag: 0, f1: 0, f2: undefined };
                } else if (e2.f1 == 1) {
                    return e1;
                }
            }
            return [3, e1, e2];
        }
    }
    throw "oops";
}

function ofDepth(n) {
    if (n == 0) {
        return { tag: 1, f1: undefined, f2: undefined };
    }
    let inner = ofDepth(n - 1);
    return { tag: 3, f1: inner, f2: inner };
}

for (let i = 0; i < 1000; ++i) {
    let tree = ofDepth(4);
    for (let j = 0; j < 4; ++j) {
        tree = diff(tree);
    }
    tree = simplify(tree);
}
