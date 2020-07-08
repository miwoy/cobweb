const {
    md5
} = require("../lib/common/encrypt")
const inflection = require('inflection')
const {
    splitRouter
} = require("lib/common/util")
/**
 * @model User 用户模型
 */
module.exports = (sequelize, DataTypes) => {
    const m = sequelize.define("user", {
        username: {
            type: DataTypes.STRING(100),
            unique: true,
            comment: "唯一代码",
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: "用户中文名"
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: true,
            validate: {
                isEmail: {
                    msg: "必须是邮箱格式"
                }
            },
            comment: "邮箱"
        },
        mobile: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: true,
            comment: "手机号",
            validate: {
                is: {
                    args: [/^(13[0-9]{1}|14[5|7|9]{1}|15[0-3|5-9]{1}|166|17[0-3|5-8]{1}|18[0-9]{1}|19[8-9]{1}){1}\d{8}$/i],
                    msg: "手机号格式不正确"
                }
            }
        },
        _password: {
            type: DataTypes.STRING(255),
            comment: "密码",
            field: "password",
            set(password) {
                throw new GeneralityError("非法操作")
            },
            get() {
                return
            }
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "密码不能为空"
                }
            }
        },
        pwdSalt: {
            type: DataTypes.STRING(255),
            comment: "密码盐",
            get() {
                return undefined
            }
        },
        avatar: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: "头像"
        },
        enabled: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            comment: "账户是否启用",
            defaultValue: false
        },
        rememberToken: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        apiToken: {
            type: DataTypes.STRING(60),
            allowNull: true,
            comment: "用户的 API 接口 Token"
        },
        organizationId: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: "所属组织Id"
        },
        attributes: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: "属性"
        },
        loginedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: "最后一次登录时间"
        },
        validatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: "邮箱验证时间"
        },
        acceptedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: "同意保密协议时间"
        }
    }, {
        hooks: {
            beforeCreate: function (data) {
                // 随机四位十六进制密码盐
                data.pwdSalt = Math.ceil(Math.random() * 65536).toString(16).padStart(4, "0")
                data.setDataValue("_password", md5(data.password + data.getDataValue("pwdSalt")))
            }
        },
        defaultScope: {
            attributes: {
                exclude: ["_password", "password", "pwdSalt", "apiToken", "rememberToken"]
            },
            where: {
                enabled: true
            }
        },
        scopes: {
            enabled: {
                where: {
                    enabled: true
                }
            }
        }
    })

    m.associate = function (models) {
        this.hasOne(models.test, {
            foreignKey: "user1Id",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
            as: "test1"
        })
        this.hasOne(models.test, {
            foreignKey: "user2Id",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
            as: "test2"
        })
        this.belongsToMany(models.role, {
            through: "userRoles"
        })
    }

    m.prototype.verify = function (password) {
        let r = md5(password + this.getDataValue("pwdSalt")) === this.getDataValue("_password")
        if (!r) throw new InvalidArgsGeneralityError("密码验证失败")
        return r
    }

    m.prototype.updatePwd = async function (password) { // 校验旧密码
        this.setDataValue("_password", md5(password + this.getDataValue("pwdSalt")))
        await this.save()
        return true
    }

    m.prototype.resetPwd = async function (password) {
        this.pwdSalt = Math.ceil(Math.random() * 65536).toString(16).padStart(4, "0")
        await this.updatePwd(password)
        return true
    }

    m.permissionVerify = async function (userId, routerName, paths) {
        const filterModel = ["user", "site"]
        let scope = {}
        filterModel.map(m => {
            let index = paths.findIndex(p => p == inflection.pluralize(m))
            scope[m] = index >= 0 && paths[index + 1] && paths[index + 1].length == 32 ? paths[index + 1] : null
        })

        let r = await m.scope("enabled").findOne({
            include: {
                model: m.associations.userSiteRoles.target,
                where: {
                    userId: userId,
                    siteId: {
                        "$or": [null, scope["site"]]
                    } // 站点和公共权限
                },
                include: {
                    model: m.associations.userSiteRoles.target.associations.role.target,
                    include: {
                        attributes: ["scope"],
                        model: m.associations.userSiteRoles.target.associations.role.target.associations.rolePermissions.target,
                        include: {
                            order: ["code", "desc"], // 越精确越优先
                            model: m.associations.userSiteRoles.target.associations.role.target.associations.rolePermissions.target.associations.permission.target,
                            where: {
                                code: splitRouter(routerName)
                            }
                        }
                    }

                }
            }
        })

        if (r && r.scope == "SELF" && scope["user"]) { // 以最准备的权限为准
            return scope["user"] && scope["user"] == userId
        }
        return !!r
    }

    return m
}