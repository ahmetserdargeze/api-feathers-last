// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function LibraryItemTypeModel(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const libraryItemType = sequelizeClient.define('library_item_type', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }, library_item_description: {
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
  (libraryItemType as any).associate = function (models: any) {
  };

  return libraryItemType;
}
