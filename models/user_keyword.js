const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserKeyword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserKeyword.init(
    {},
    {
      sequelize,
      modelName: 'user_keyword',
      paranoid: true,
    }
  );
  return UserKeyword;
};
