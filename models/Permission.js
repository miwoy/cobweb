/**
 * @model Permission 权限模型
 */
module.exports = (sequelize, DataTypes) => {
    const m = sequelize.define("permission", {
        code: {
            type: DataTypes.STRING(512),
            unique: true,
            comment: "唯一代码",
            allowNull: false
        },
		name: {
            type: DataTypes.STRING(512),
            allowNull: false,
            comment: "权限名称"
		},
		description: {
            type: DataTypes.STRING(512),
            allowNull: true,
            comment: "权限描述"
        },
        group: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: "权限分组，用于查询与使用",
            defaultValue: "default"
        }
	}, {
        defaultScope: {
            attributes: {
                exclude: []
            }
        }
    })  
    m.associate = function(models) {
        // associate
        this.belongsToMany(models.role, { through: models.rolePermission})
        this.hasMany(models.rolePermission, {
            foreignKey: "permissionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            // as: "rolePermissions"
        })
    }
    
    return m;
}

/**
 * scope
 * all
 * self
 * part
 */