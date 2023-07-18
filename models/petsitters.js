'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Petsitters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Reviews, {
        sourceKey: "petsitterId",
        foreignKey: 'PetsitterId',
      })
      this.hasMany(models.Reservations, {
        sourceKey: "petsitterId",
        foreignKey: 'PetsitterId',
      })
    }
  }
  Petsitters.init({
    petsitterId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      field: 'petsitter_Id',
      type: DataTypes.INTEGER
    },
    career: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
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
    modelName: 'Petsitters',
  });
  return Petsitters;
};