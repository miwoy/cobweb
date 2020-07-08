/**
 * @model Role 角色模型 
 */

module.exports = (sequelize, DataTypes) => {
    const m = sequelize.define("role", {
        code: {
            type: DataTypes.STRING(100),
            unique: true,
            comment: "唯一代码",
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: "角色名称"
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: true,
            comment: "角色描述"
        },
        parentId: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: "父级Id"
        }
    }, {
        defaultScope: {
            attributes: {
                exclude: ["rolePermissions"]
            }
        }
    })

    m.associate = function(models) {
        this.belongsToMany(models.permission, {
            through: models.rolePermission
        })
    
        this.belongsToMany(models.user, {
            through: "userRoles"
        })
    }

    return m
}