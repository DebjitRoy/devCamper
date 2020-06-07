// Middleware to handle Select, Pagination, Sorting

const advancedResult = (model, populate) => async (req, res, next) => {
  const reqQuery = { ...req.query };
  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((field) => delete reqQuery[field]);

  let queryStr = JSON.stringify(reqQuery);
  // replaces gt with $gt, gte with $gte etc
  // $gt, $lt etc are used by mongoose for Number data
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // query str to get all bootcamps with averageCost <=10000
  // /api/v1/bootcamps?averageCost[lte]=10000

  // query str to get all bootcamps with careers array includes some value
  // /api/v1/bootcamps?careers[in]=Data Science

  // Find By State:
  // /api/v1/bootcamps?location.state=CA

  //  Finding Resource
  let query = model.find(JSON.parse(queryStr));

  // Select Fields
  // /api/v1/bootcamps?select=name,description
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort Fields
  // /api/v1/bootcamps?sort=-averageCost
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("createdAt");
  }

  // Pagination
  //   /api/v1/bootcamps?limit=2&page=1&select=name
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5; // per page
  const startIdx = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  const totalPage = Math.round(total / limit);

  query = query.skip(startIdx).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }
  const results = await query;
  // pagination result
  const pagination = { totalPage };
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIdx > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResult;
