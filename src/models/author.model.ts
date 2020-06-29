// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function Author(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const author = sequelizeClient.define('author', {
    author_id: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }, author_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps:false,
    hooks: {
      beforeCount(options: any) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  (author as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return author;
}
