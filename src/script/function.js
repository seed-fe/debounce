// 判断符号是否相同
// 做位运算，二进制最高位表示符号，所以判断异或运算结果的正负就能判断a/b的符号是否相同
function sameSign (a, b) {
	// body... 
	return (a ^ b) >= 0
}
// 定义向量，参数a和b表示起点和终点的坐标
function vector (a, b) {
    // body...
    return {
        x: b.x - a.x,
        y: b.y - a.y
    }
}
// 向量叉乘
function vectorProduct (v1, v2) {
    // body...
    return v1.x * v2.y - v2.x * v1.y;
}
// 判断p点是否在三角形abc内
function isPointInTrangle (p, a, b, c) {
	// body... 
	var pa = vector(p, a);
	var pb = vector(p, b);
	var pc = vector(p, c);
	var t1 = vectorProduct(pa, pb);
	var t2 = vectorProduct(pb, pc);
	var t3 = vectorProduct(pc, pa);
	return sameSign(t1, t2) && sameSign(t2, t3);
}
// 判断是否需要延迟
function needDelay (elem, leftCorner, currMousePos) {
	// body... 
	var offset = elem.offset();
	var topLeft = {
		x: offset.left,
		y: offset.top
	}
	var bottomLeft = {
		x: offset.left,
		y: offset.top + elem.height()
	}
	return isPointInTrangle(currMousePos, leftCorner, topLeft, bottomLeft)
}