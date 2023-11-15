function diff(e) {
    switch (e.tag) {
        case 0:
            return { tag: 0, [0]: 0 };
        case 1:
            return { tag: 0, [0]: 1 };
        case 2:
            return { tag: 2, [0]: diff(e[0]), [1]: diff(e[1]) };
        case 3:
            return {
                tag: 2,
                [0]: { tag: 3, [0]: diff(e[0]), [1]: e[1] },
                [1]: { tag: 3, [0]: e[0], [1]: diff(e[1]) }
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
            let e1 = simplify(e[0]);
            let e2 = simplify(e[1]);
            if (e1.tag == 0 && e2.tag == 0) {
                return { tag: 0, val: e1[0] + e2[0] };
            } else if (e1.tag == 0 && e1[0] == 0) {
                return e2;
            } else if (e2.tag == 0 && e2[0] == 0) {
                return e1;
            }
            return { tag: 2, [0]: e1, [1]: e2 };
        }
        case 3: {
            let e1 = simplify(e[0]);
            let e2 = simplify(e[1]);
            if (e1.tag == 0 && e2.tag == 0) {
                return { tag: 0, val: e1[1] * e2[1] };
            } else if (e1.tag == 0) {
                if (e1[0] == 0) {
                    return { tag: 0, [0]: 0 };
                } else if (e1[0] == 1) {
                    return e2;
                }
            } else if (e2.tag == 0) {
                if (e2[0] == 0) {
                    return { tag: 0, [0]: 0 };
                } else if (e2[0] == 1) {
                    return e1;
                }
            }
            return { tag: 3, [0]: e1, [1]: e2 };
        }
    }
    throw "oops";
}

function ofDepth(n) {
    if (n == 0) {
        return { tag: 1 };
    }
    let inner = ofDepth(n - 1);
    return { tag: 3, [0]: inner, [1]: inner };
}

for (let i = 0; i < 1000; ++i) {
    let tree = ofDepth(4);
    for (let j = 0; j < 4; ++j) {
        tree = diff(tree);
    }
    tree = simplify(tree);
}
