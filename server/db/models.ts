// import sequelize from "./config.ts";
// import { DataTypes } from "sequelize";

// import { Model, Optional } from "sequelize";

// export interface UserAttributes {
//     id: number;
//     username: string;
//     chatId: number;
//     registeredAt: Date;
// }

// interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
//     declare id: number;
//     declare username: string;
//     declare chatId: number;
//     declare registeredAt: Date;
// }

// User.init({
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     username: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     chatId: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     registeredAt: {
//         type: DataTypes.DATE,
//         allowNull: false
//     }
// }, {
//     sequelize,
//     modelName: "User"
// });