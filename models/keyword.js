const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Keyword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Keyword.belongsToMany(models.user, {
        through: models.userKeyword,
        foreignKey: 'keywordId',
        otherKey: 'userId',
      });
    }
  }
  Keyword.init(
    {
      keyword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adWordCount: {
        type: DataTypes.INTEGER,
        field: 'ad_word_count',
      },
      linkCount: {
        type: DataTypes.INTEGER,
        field: 'link_count',
      },
      totalSearchResult: {
        type: DataTypes.STRING,
        field: 'total_search_result',
      },
      html: {
        type: DataTypes.TEXT,
      },
      searchedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'searched_at',
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
      modelName: 'keyword',
      tableName: 'keyword',
      paranoid: true,
    }
  );
  return Keyword;
};
