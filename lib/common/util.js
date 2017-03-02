export default {
	convertC2P: convertC2P,
	convertP2C: convertP2C,
	convertC2_: convertC2_,
	convert_2C: convert_2C,
	sortByNumber: sortByNumber
}

/**
 * 小驼峰转化为大驼峰
 */
function convertC2P(name) {
	if (!name) return name;
	return name.charAt(0).toUpperCase() + name.substr(1);
}

/**
 * 大驼峰转化为小驼峰
 */
function convertP2C(name) {
	if (!name) return name;
	return name.charAt(0).toLowerCase() + name.substr(1);
}

/**
 * 小驼峰转化为匈牙利
 */
function convertC2_(name) {
	if (!name) return name;
	return name.replace(/[A-Z]/g, c=>"_"+c.toLowerCase());
}

/**
 * 匈牙利转化为小驼峰
 */
function convert_2C(name) {
	if (!name) return name;
	return name.replace(/_\w/g, c=>c.charAt(1).toUpperCase())
}

/**
 * 针对文件对象对文件名内数字提取并顺序排序，数组元素对象必须包含file_name属性
 * @param  {[type]} fileList [description]
 * @return {[type]}          [description]
 */
function sortByNumber(fileList) {
    for (var i = fileList.length - 1; i > 0; i--) {
        for (var j = i; j < fileList.length; j++) {
            var reg = /\d+/g;
            var num1 = 0,
                num2 = 0;
            if (reg.test(fileList[j - 1].file_name)) {
                num1 = parseInt(fileList[j - 1].file_name.match(reg).join(""));
            }

            if (reg.test(fileList[j].file_name)) {
                num2 = parseInt(fileList[j].file_name.match(reg).join(""));
            }

            if (num1 > num2) {
                var tempFile = fileList[j - 1];
                fileList[j - 1] = fileList[j];
                fileList[j] = tempFile;
            } else {
                break;
            }

        }
    }
    return fileList;
}