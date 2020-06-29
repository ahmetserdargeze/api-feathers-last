// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function LibraryItemInfoModel(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const libraryItemInfo = sequelizeClient.define('library_item_info', {
    library_item_fk: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      references: {
        model: "library_item",
        key: 'library_item_id'
      }
    },
    library_item_author_fk: {
      type: DataTypes.UUIDV4,
      references: {
        model: "author",
        key: 'author_id'
      }
    },
    library_item_published_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    library_item_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps:false,
    hooks: {
      beforeCount(options: any) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  (libraryItemInfo as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return libraryItemInfo;
}
