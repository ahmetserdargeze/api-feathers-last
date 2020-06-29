// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function LibraryItemInstanceStatusModel(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const libraryItemInstanceStatus = sequelizeClient.define('library_item_instance_status', {
    library_item_instance_status_type: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }, library_item_instance_status_type_description: {
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
  (libraryItemInstanceStatus as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return libraryItemInstanceStatus;
}
