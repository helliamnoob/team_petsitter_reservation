'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users,{
        targetKey: 'user_id', 
        foreignKey: 'User_id', 
      });
      this.belongsTo(models.Petsitters,{
        targetKey: 'petsitter_id', 
        foreignKey: 'Petsitter_id', 
      });
    }
  }
  Reservations.init({
    reservation_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    User_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references:{
        model:'Users',
        key:'user_id',
      },
      onDelete: 'CASCADE'
    },
    Petsitter_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references:{
        model:'Petsitters',
        key:'petsitter_id',
      },
      onDelete: 'CASCADE',
    },
    start_date: {
      allowNull: false,
      type: DataTypes.DATE
    },
    end_date: {
      allowNull: false,
      type: DataTypes.DATE
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
    modelName: 'Reservations',
  });
  return Reservations;
};