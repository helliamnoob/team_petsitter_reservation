'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users,{
        targetKey: 'userId', 
        foreignKey: 'UserId', 
      });
      this.belongsTo(models.Petsitters,{
        targetKey: 'petsitterId', 
        foreignKey: 'PetsitterId', 
      });
    }
  }
  Reviews.init({
    reviewId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references:{
        model:'Users',
        key:'userId',
      },
      onDelete: 'CASCADE'
    },
    PetsitterId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references:{
        model:'Petsitters',
        key:'petsitterId',
      },
      onDelete: 'CASCADE',
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING
    },
    star:{
      allowNull: false,
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Reviews',
  });
  return Reviews;
};