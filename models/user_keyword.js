const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserKeyword extends Model {
    static associate(models) {
      // define association here
      models.userKeyword.belongsTo(models.user, {
        foreignKey: 'userId',
      });
      models.userKeyword.belongsTo(models.keyword, {
        foreignKey: 'keywordId',
      });
    }
  }
  UserKeyword.init(
    {
      userId: { type: DataTypes.INTEGER, primaryKey: true, field: 'user_id' },
      keywordId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'keyword_id',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      modelName: 'userKeyword',
      tableName: 'user_keyword',
      paranoid: true,
    }
  );
  return UserKeyword;
};
