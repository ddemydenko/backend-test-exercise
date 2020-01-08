module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PageView',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      pageId: {
        type: DataTypes.INTEGER,
        field: 'page_id',
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.JSON,
        field: 'user_agent',
      },
      ip: {
        type: DataTypes.STRING,
        field: 'ip',
      },
      countryCode: {
        type: DataTypes.STRING,
        field: 'country_code',
      },
      eventTimestamp: {
        type: 'TIMESTAMP',
        field: 'event_timestamp',
        allowNull: true,
      }
    },
    {
      tableName: 'page_views',
      timestamps: false,
    });
};
