const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Contact = sequelize.define(
    "Contact",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Contacts",
        },
      },
      linkPrecedence: {
        type: DataTypes.ENUM("primary", "secondary"),
        defaultValue: "primary",
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );

  return Contact;
};
