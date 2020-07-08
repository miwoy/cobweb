/**
 * @model RolePermission
 */
module.exports = (sequelize, DataTypes) => {
	class RolePermission extends sequelize.BaseModel {
	}
	RolePermission.init({
		scope: {
            type: DataTypes.ENUM("ALL", "SELF"),
            defaultValue: "SELF"
		}
	}, {
		sequelize,
		modelName: "rolePermission"
	});

	RolePermission.associate = function(models) {
        this.belongsTo(models.role, {
			foreignKey: "roleId"
		})
        this.belongsTo(models.permission, {
			foreignKey: "permissionId"
		})
    }

	return RolePermission;
};