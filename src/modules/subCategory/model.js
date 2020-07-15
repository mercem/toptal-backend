const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required.'],
      minlength: 1,
      trim: true,
      unique: true,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ----- MIDDLEWARES -----

schema.pre('find', function findPre() {
  this.populate('category');
});

// ----- VIRTUALS -----

schema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
});

const SubCategory = mongoose.model('SubCategory', schema);

module.exports = { SubCategory };
