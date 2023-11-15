function diff(e) {
    switch (e.tag) {
        case 0:
            return { tag: 0, val: 0 };
        case 1:
            return { tag: 0, val: 1 };
        case 2:
            return { tag: 2, lhs: diff(e.lhs), rhs: diff(e.rhs) };
        case 3:
            return {
                tag: 2,
                lhs: { tag: 3, lhs: diff(e.lhs), rhs: e.rhs },
                rhs: { tag: 3, lhs: e.lhs, rhs: diff(e.rhs) }
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
            let e1 = simplify(e.lhs);
            let e2 = simplify(e.rhs);
            if (e1.tag == 0 && e2.tag == 0) {
                return { tag: 0, val: e1.val + e2.val };
            } else if (e1.tag == 0 && e1.val == 0) {
                return e2;
            } else if (e2.tag == 0 && e2.val == 0) {
                return e1;
            }
            return { tag: 2, lhs: e1, rhs: e2 };
        }
        case 3: {
            let e1 = simplify(e.lhs);
            let e2 = simplify(e.rhs);
            if (e1.tag == 0 && e2.tag == 0) {
                return { tag: 0, val: e1[1] * e2[1] };
            } else if (e1.tag == 0) {
                if (e1.val == 0) {
                    return { tag: 0, val: 0 };
                } else if (e1.val == 1) {
                    return e2;
                }
            } else if (e2.tag == 0) {
                if (e2.val == 0) {
                    return { tag: 0, val: 0 };
                } else if (e2.val == 1) {
                    return e1;
                }
            }
            return { tag: 3, lhs: e1, rhs: e2 };
        }
    }
    throw "oops";
}

function ofDepth(n) {
    if (n == 0) {
        return { tag: 1 };
    }
    let inner = ofDepth(n - 1);
    return { tag: 3, lhs: inner, rhs: inner };
}

for (let i = 0; i < 1000; ++i) {
    let tree = ofDepth(4);
    for (let j = 0; j < 4; ++j) {
        tree = diff(tree);
    }
    tree = simplify(tree);
}
