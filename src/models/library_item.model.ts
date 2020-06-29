// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function LibraryItemModel(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const libraryItem = sequelizeClient.define('library_item', {
    library_item_id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
    ,library_item_type_fk: {
      type: DataTypes.INTEGER,
      references:{
        model:"library_item_type",
        key:'id'
      }
    },
  }, {
    timestamps: false,
    hooks: {
      beforeCount(options: any) {
        options.raw = true;
      }
    }
  });


  (libraryItem as any).associate = function (models: any) {
  };

  return libraryItem;
}
