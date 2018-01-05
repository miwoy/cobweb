/**
 * @model test
 */
export default (sequelize, DataTypes) => {
	const m = sequelize.define("test", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(100)
		},
		desc: {
			type: DataTypes.STRING(100)
		}
	}, {
		classMethods: {
			associate: function() {
				// associate
			}
		}
	});

	return m;
};
