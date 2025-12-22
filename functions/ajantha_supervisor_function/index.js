const catalyst = require('zcatalyst-sdk-node');

module.exports = async (req, res) => {
  try {
    const app = catalyst.initialize(req);
    const datastore = app.getDataStore();

    const table = datastore.table('TripData'); // Your table name
    const response = await table.getAllRows();

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
