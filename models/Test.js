export default class Test {
    constructor() {
        this.id = { // ID强制使用36位uuid类型，type固定为String类型
            type: String
        };
        this.name = { // 
            type: String,
            uniq: true,  // 唯一索引
            notNull: true, // 非空字段
            size: 100,  // 字段长度，decimal时不需要设置，使用默认10,2
            mapping: {  // 映射对象
                type: "char"
            },
            comment: "测试名称"  // 字段描述
        };
        this.description = {
            type: String,
            size: 512,
            default: "详情默认值",  // 默认值
            comment: "详情描述"
        };
        this.float = { // decimal类型不用设置size,默认使用10，2
            type: Number,
            index: 1,  // 普通索引
            mapping: {
                type: "decimal" // 映射类型
            }
        }
    }
}
