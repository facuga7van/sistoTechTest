module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      betriebId: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.STRING,
      },
      gastId: {
        type: DataTypes.INTEGER,
      },
      peopleCount: {
        type: DataTypes.SMALLINT,
      },
      msg: {
        type: DataTypes.STRING,
      },
      notes: {
        type: DataTypes.STRING,
      },
      tags: {
        type: DataTypes.STRING,
      },
      reservedFor: {
        type: DataTypes.STRING,
      },
      shiftId: {
        type: DataTypes.INTEGER,
      },
      roomId: {
        type: DataTypes.INTEGER,
      },
      stayTime: {
        type: DataTypes.SMALLINT,
      },
      userPerSmsInform: {
        type: DataTypes.STRING,
      },
      isTablePlan: {
        type: DataTypes.STRING,
      },
      feedbackHash: {
        type: DataTypes.STRING,
      },
      feedbackSent: {
        type: DataTypes.STRING,
      },
      addOns: {
        type: DataTypes.STRING,
      },
      orderId: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.STRING,
      },
      hash: {
        type: DataTypes.STRING,
      },
      locked: {
        type: DataTypes.INTEGER,
      },
      paymentTemplate: {
        type: DataTypes.INTEGER,
      },
      paymentId: {
        type: DataTypes.INTEGER,
      },
      invoice: {
        type: DataTypes.FLOAT,
      },
      recurrenceId: {
        type: DataTypes.INTEGER,
      },
      source: {
        type: DataTypes.STRING,
      },
      turnover: {
        type: DataTypes.FLOAT,
      },
      children: {
        type: DataTypes.INTEGER,
      },
      highChairs: {
        type: DataTypes.INTEGER,
      },
      resHotelID: {
        type: DataTypes.INTEGER,
      },
      referrer: {
        type: DataTypes.STRING,
      }
    }, {
      tableName: 'reservations',
      timestamps: false,  // Si tu base de datos no tiene las columnas de timestamps (createdAt, updatedAt)
    });
  
    return Reservation;
  };
  