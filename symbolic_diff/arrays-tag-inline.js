function diff(e) {
    switch (e[0]) {
        case 0:
            return [0, 0];
        case 1:
            return [0, 1];
        case 2:
            return [2, diff(e[1]), diff(e[2])];
        case 3:
            return [2, [3, diff(e[1]), e[2]], [3, diff(e[2]), e[1]]];
    }
    throw "oops";
}

function simplify(e) {
    switch (e[0]) {
        case 0:
            return e;
        case 1:
            return e;
        case 2: {
            let e1 = simplify(e[1]);
            let e2 = simplify(e[2]);
            if (e1[0] == 0 && e2[0] == 0) {
                return [0, e1[1] + e2[1]];
            } else if (e1[0] == 0 && e1[1] == 0) {
                return e2;
            } else if (e2[0] == 0 && e2[1] == 0) {
                return e1;
            }
            return [2, e1, e2];
        }
        case 3: {
            let e1 = simplify(e[1]);
            let e2 = simplify(e[2]);
            if (e1[0] == 0 && e2[0] == 0) {
                return [0, e1[1] * e2[1]];
            } else if (e1[0] == 0) {
                if (e1[1] == 0) {
                    return [0, 0];
                } else if (e1[1] == 1) {
                    return e2;
                }
            } else if (e2[0] == 0) {
                if (e2[1] == 0) {
                    return [0, 0];
                } else if (e2[1] == 1) {
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
        return [1];
    }
    let inner = ofDepth(n - 1);
    return [3, inner, inner];
}

for (let i = 0; i < 1000; ++i) {
    let tree = ofDepth(4);
    for (let j = 0; j < 4; ++j) {
        tree = diff(tree);
    }
    tree = simplify(tree);
}

