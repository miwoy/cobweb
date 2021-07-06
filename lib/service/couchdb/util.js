

module.exports = {
    splitEach: async (arry, splitNum, asyncFunc) => {
        let skip = 0
        let r = []
        while (true) {
            if (skip >= arry.length) return r
            r = r.concat(await Promise.all(arry.slice(skip, splitNum + skip).map(doc => asyncFunc(doc))))
            skip += splitNum
        }
    }
}
