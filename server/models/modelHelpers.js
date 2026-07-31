// The frontend (and this project's own service layer) was originally built
// against Mongoose documents, which always serialize their primary key as
// `_id`. To keep every API response byte-for-byte compatible after moving to
// Sequelize/SQLite, every model mirrors its `id` column as `_id` in JSON output.
const withMongoStyleJSON = (model) => {
  model.prototype.toJSON = function toJSON() {
    const values = { ...this.get() };
    if (values.id !== undefined && values.id !== null) {
      values._id = String(values.id);
    }
    return values;
  };
  return model;
};

module.exports = { withMongoStyleJSON };
