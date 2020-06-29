// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes} from 'sequelize';
import {Application} from '../declarations';

export default function MemberTypeModel(app: Application) {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const memberType = sequelizeClient.define('member_type', {
    member_type_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }, member_type_description: {
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
  (memberType as any).associate = function (models: any) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return memberType;
}
