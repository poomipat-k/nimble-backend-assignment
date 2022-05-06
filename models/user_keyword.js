const { Model } = require('sequelize');
module.exports = (sequelize) => {
  class UserKeyword extends Model {
    // static associate(models) {
    //   // define association here
    // }
  }
  UserKeyword.init(
    {},
    {
      sequelize,
      modelName: 'userKeyword',
      tableName: 'user_keyword',
      paranoid: true,
    }
  );
  return UserKeyword;
};
