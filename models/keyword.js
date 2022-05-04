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
      Keyword.belongsToMany(models.User, { through: models.UserKeyword });
    }
  }
  Keyword.init(
    {
      keyword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ad_word_count: {
        type: DataTypes.INTEGER,
      },
      link_count: {
        type: DataTypes.INTEGER,
      },
      total_search_result: {
        type: DataTypes.BIGINT,
      },
      html: {
        type: DataTypes.TEXT,
      },
      searched_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'keyword',
      paranoid: true,
    }
  );
  return Keyword;
};
