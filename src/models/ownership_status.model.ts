// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function OwnershipStatusModel(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const ownershipStatus = sequelizeClient.define('ownership_status', {
    ownership_status_type: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }, ownership_status_description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false,
    hooks: {
      beforeCount(options: any) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  (ownershipStatus as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return ownershipStatus;
}
