// const Pool = require("pg").Pool;
// // const token = require('./token')

require("dotenv").config();
const logger = require("../Logger/Logger");

const { execQuery, execQueryNP } = require("./appDao");

// const pool = new Pool({
//   user: process.env.user,
//   host: process.env.host,
//   database: process.env.database,
//   password: process.env.password,
//   port: process.env.port,
// });

// pool.on("error", (err, client) => {
//   console.error("Unexpected error on idle client", err);
//   process.exit(-1);
// });

// Used for login, operation on individual user
async function getUserByMobile(mobile) {
  logger.info(`DB Access Started getUserByMobile- ${mobile}`);

  let query = "select familyid,role from family where loginmobile=$1";
  let props = [mobile];

  const res = await execQuery(query, props);
  try {
    if (res.rowCount != 0) {
      logger.info(`DB Access Completed- ${mobile} User Returned`);
      // console.log(res.rows[0]);
      return res.rows[0];
      // return true
    }
  } catch (e) {
    res.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(`DB Error- ${(mobile, e)} `);
  }

  logger.warn(`DB Access Completed- ${mobile} Not Found`);
  return false;
}

//Directory Page
const getAllFamily = async (request, response) => {
  const { dataFilter, limit, offset } = request.body;
  try {
    let query =
      "select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid  order by fm.membername asc limit $1  offset $2";
    let props = [limit, offset];
    let CountQuery = "select count(*) from family";
    let CountProps = [];
    if (Object.keys(dataFilter).length > 0) {
      if (dataFilter.charFilter) {
        console.log("Search by character");
        query =
          "select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where upper(fm.membername) like $3 order by fm.membername asc limit $1  offset $2";
        props = [limit, offset, `${dataFilter.charFilter}%`];
        CountQuery =
          "select count(*) from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid  where upper(fm.membername) like $1";
        CountProps = [`${dataFilter.charFilter}%`];
      } else {
        let dataNode = dataFilter.advFilter.data;
        if (dataFilter.advFilter.filterBy.area) {
          console.log("Query with Area filters");
          // console.log(dataNode.search);
          // console.log(dataNode.filter);
          const finalData = Object.keys(dataNode.filter).filter(
            (x) => dataNode.filter[x] === true
          );

          // console.log(finalData);
          var inQuery = "(";
          finalData.map((x) => (inQuery += `'${x}',`));
          inQuery = inQuery.slice(0, -1);
          inQuery += ")";
          // console.log(inQuery);
          query =
            "select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where lower(fm.membername) like lower($3) and ha.homearea in " +
            inQuery +
            " order by fm.membername asc limit $1  offset $2";

          console.log(query);
          const param = dataNode.search.membername;
          props = [limit, offset, param];
          CountQuery =
            "select count(*) from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where lower(fm.membername) like lower($1)";
          CountProps = [param];
        } else {
          console.log("Query with no filters");
          let SearchKey = Object.keys(dataNode.search)[0];
          const filterQueries = {
            query_getAllFamily_Filter_familyid:
              "select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where f.familyid = $3 order by fm.membername asc limit $1  offset $2",
            query_getAllFamily_Filter_membername:
              "select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where lower(fm.membername) like lower($3) order by fm.membername asc limit $1  offset $2",
            query_getAllFamily_Filter_mobile:
              "select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where fm.mobile = $3 order by fm.membername asc limit $1  offset $2",
          };
          const CountQueries = {
            query_count_search_familyid:
              "select count(*) from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where fm.familyid = $1",
            query_count_search_membername:
              "select count(*) from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where lower(fm.membername) like lower($1)",
            query_count_search_mobile:
              "select count(*) from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where fm.mobile = $1 ",
          };
          query = filterQueries[`query_getAllFamily_Filter_${SearchKey}`];

          let param = dataNode.search[SearchKey];

          props = [limit, offset, param];
          CountQuery = CountQueries[`query_count_search_${SearchKey}`];
          CountProps = [param];
        }
      }
    }
    const res = await execQuery(query, props);
    const countRes = await execQuery(CountQuery, CountProps);

    if (res.rowCount != 0) {
      response.status(200).send(
        JSON.stringify({
          data: res.rows,
          meta: { count: countRes.rows[0].count },
        })
      );
      logger.info(`DB Get All Family Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          message: "Family Not Found",
        })
      );
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` DB Error ${e}`);
  }
};
// Get individual Family
const getFamily = async (request, response) => {
  const id = parseInt(request.params.id);

  try {
    let query =
      "select ba.businessaddress,ba.businessarea,ba.businesscity,ba.businessmobile,ba.businessname,ba.businesspincode,ba.businessstate,f.familyid,ha.homeaddress,ha.homearea,ha.homecity,ha.homemobile,ha.homepincode,ha.homestate,f.website,f.emailid,fm.membername from family f left join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid left join homeaddress ha on ha.familyid = f.familyid left join businessaddress ba on ba.familyid = f.familyid where f.familyid=$1";
    let props = [id];

    const res = await execQuery(query, props);
    if (res.rowCount != 0) {
      response
        .status(200)
        // .set("Cache-Control", "public, max-age=31557600")
        .send(res.rows);
      logger.info(`DB getFamily- ${id} Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          message: "Family Not Found",
        })
      );

      logger.warn(`DB getFamily- ${id} Failed, Does not Exist`);
    }
  } catch (e) {
    logger.error(` Error Family- ${(id, e)} not found`);
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
  }
};

const updateFamily = async (request, response) => {
  const familyid = request.family_id;
  const {
    businessaddress,
    businesscity,
    businessarea,
    businessmobile,
    businessname,
    businesspincode,
    businessstate,
    emailid,
    // familyid,
    homeaddress,
    homecity,
    homearea,
    homemobile,
    homepincode,
    homestate,
    website,
    newBusiness,
  } = request.body;

  try {
    logger.info(`DB  updateFamily- ${familyid} Started`);
    // if (familyid != familyid2) {
    //   throw "Forbidden Access";
    // }

    let query = "update family set website=$1,emailid=$2 where familyid=$3";
    let props = [website, emailid, familyid];

    const res = await execQuery(query, props);

    query =
      "update homeaddress set homeaddress=$1,homemobile=$2,homepincode=$3,homecity=$4,homearea=$5,homestate=$6 where familyid=$7";
    props = [
      homeaddress,
      homemobile,
      homepincode,
      homecity,
      homearea,
      homestate,
      familyid,
    ];
    const res2 = await execQuery(query, props);

    query =
      "update businessaddress set businessaddress=$1,businessmobile=$2,businesspincode=$3,businesscity=$4,businessarea=$5,businessstate=$6,businessname=$7 where familyid=$8";
    if (newBusiness) {
      query =
        "insert into businessaddress (businessaddress,businessmobile,businesspincode,businesscity,businessarea,businessstate,businessname,familyid) values($1,$2,$3,$4,$5,$6,$7,$8)";
    }
    props = [
      businessaddress,
      businessmobile,
      businesspincode,
      businesscity,
      businessarea,
      businessstate,
      businessname,
      familyid,
    ];
    const res3 = await execQuery(query, props);

    if (res.rowCount != 0 && res2.rowCount != 0 && res3.rowCount != 0) {
      response.status(200).send(
        JSON.stringify({
          message: "Family Updated",
        })
      );
      logger.info(`DB updateFamily- ${familyid} Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          message: "family Not Found",
        })
      );

      logger.warn(`DB updateFamily- ${familyid} Failed, Does not Exist`);
    }
  } catch (e) {
    logger.error(` DB Error- ${(familyid, e)} `);
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
  }
};

const updateMobile = async (request, response) => {
  const { oldmobile, mobile, mobile2 } = request.body;
  const family_id = request.family_id;
  try {
    // if (familyid != family_id) {
    //   throw "Forbidden Access";
    // }
    if (mobile != mobile2) {
      throw "Mobile Number, not matched";
    }

    let query =
      "update family  set loginmobile=$2 where familyid=$3 and loginmobile=$1 ";
    let props = [oldmobile, mobile, family_id];

    const res = await execQuery(query, props);
    if (res.rowCount != 0) {
      response.status(200).send(res.rows);
      logger.info(`DB updateMobile- ${family_id} Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          message: "FamilyMembers Not Found",
        })
      );

      logger.warn(`DB updateMobile- ${family_id} Failed, Does not Exist`);
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` DB Error- ${(family_id, e)} `);
  }
};

const updatePP = async (request, response) => {
  const { familyid } = request.body;
  const file = request.file;
  const family_id = request.family_id;
  try {
    if (familyid != family_id) {
      throw "Forbidden Access";
    }
    const client = await pool.connect();
    logger.info(`DB  updatePP- ${family_id} Started`);
    // console.log(file.buffer);
    const res = await client.query(
      "update family set image=$1, imageName=$2,imageSize=$3,imageType=$4, lastUpdatedt= CURRENT_TIMESTAMP where familyid=$5",
      [file.buffer, file.originalname, file.size, file.mimetype, familyid]
    );
    client.release();
    if (res.rowCount != 0) {
      response
        .status(200)
        .send(JSON.stringify({ Message: "success updating image" }));
      logger.info(`DB updatePP- ${family_id} Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          message: "family Not Found",
        })
      );

      logger.warn(`DB family_id- ${family_id} Failed, Does not Exist`);
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` DB Error- ${(family_id, e)} `);
  }
};

const deletePP = async (request, response) => {
  const family_id = request.family_id;
  try {
    const client = await pool.connect();
    logger.info(`DB  deletePP- ${family_id} Started`);
    // console.log(file.buffer);
    const res = await client.query(
      "update family set image=null, imageName=null,imageSize=null,imageType=null, lastUpdatedt= CURRENT_TIMESTAMP where familyid=$1",
      [family_id]
    );
    client.release();
    if (res.rowCount != 0) {
      response
        .status(200)
        .send(JSON.stringify({ Message: "success deleting image" }));
      logger.info(`DB deletePP- ${family_id} Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          message: "family Not Found",
        })
      );

      logger.warn(`DB family_id- ${family_id} Failed, Does not Exist`);
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` DB Error- ${(family_id, e)} `);
  }
};
// Get all the members of a familt
const getFamilyMembers = async (request, response) => {
  const id = parseInt(request.params.id);

  try {
    let query =
      "select * from familymember where familyid=$1 order by ( CASE WHEN relation = 'Self' THEN 0 WHEN relation = 'Spouse' THEN 1 WHEN relation ='Grand Mother' OR relation='Grand Father' THEN 2 WHEN relation ='Father' OR relation='Mother' THEN 3 WHEN relation ='Son' OR relation='Daughter' THEN 4 WHEN relation ='Daughter in law' OR relation='Son in law' THEN 5 ELSE 6 END )";
    let props = [id];

    const res = await execQuery(query, props);
    if (res.rowCount != 0) {
      response.status(200).send(res.rows);
      logger.info(`DB getFamilyMembers- ${id} Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          message: "FamilyMembers Not Found",
        })
      );

      logger.warn(`DB getFamilyMembers- ${id} Failed, Does not Exist`);
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` DB Error- ${(id, e)} `);
  }
};

const deleteFamilyMember = async (request, response) => {
  const familyid = request.family_id;
  const { memberid } = request.body;

  try {
    // if (familyid != family_id) {
    //   throw "Forbidden Access";
    // }

    let query = "delete from familymember where memberid=$1 and familyid=$2";
    let props = [memberid, familyid];

    const res = await execQuery(query, props);
    if (res.rowCount != 0) {
      response.status(200).send(
        JSON.stringify({
          message: "FamilyMember Deleted",
        })
      );
      logger.info(`DB deleteFamilyMember- ${memberid} Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          message: "FamilyMember Not Found",
        })
      );

      logger.warn(`DB getFamilyMembers- ${memberid} Failed, Does not Exist`);
    }
  } catch (e) {
    logger.error(` DB Error- ${(memberid, e)} `);
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
  }
};

const createFamilyMember = async (request, response) => {
  const familyid2 = request.family_id;
  // console.log(request.body);
  const {
    familyid,
    membername,
    relation,
    dob,
    education,
    specialization,
    sankhe,
    mobile,
  } = JSON.parse(request.body.form_data);
  const file = request.file;
  try {
    logger.info(`DB  createFamilyMember- of ${familyid} Started`);
    // if (familyid != familyid2) {
    //   throw "Forbidden Access";
    // }

    let query =
      "insert into familyMember ( familyId, membername , relation , DOB , education , specialization , sankhe, mobile ,image,imageType,lastUpdatedAt) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP)";
    let props = [
      familyid2,
      membername,
      relation,
      dob,
      education,
      specialization,
      sankhe,
      mobile,
      file ? file.buffer : null,
      file ? file.mimetype : null,
    ];

    if (relation == "Self") {
      query =
        "insert into familyMember ( familyId, memberId, membername , relation , DOB , education , specialization , sankhe, mobile,image,imageType,lastUpdatedAt ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP)";
      props = [
        familyid2,
        "1",
        membername,
        relation,
        dob,
        education,
        specialization,
        sankhe,
        mobile,
        file ? file.buffer : null,
        file ? file.mimetype : null,
      ];
    }

    const res = await execQuery(query, props);
    if (res.rowCount != 0) {
      response.status(200).send(
        JSON.stringify({
          message: "FamilyMember Added",
        })
      );
      logger.info(`DB createFamilyMember- ${familyid} Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          message: "family Not Found",
        })
      );

      logger.warn(`DB createFamilyMember- ${familyid} Failed, Does not Exist`);
    }
  } catch (e) {
    logger.error(` DB Error- ${(familyid, e)} `);
    if (e.code == "23505") {
      response.status(500).send(
        JSON.stringify({
          message: "Error- Delete the member first",
        })
      );
    } else {
      response.status(500).send(
        JSON.stringify({
          message: "DB Error",
        })
      );
    }
  }
};

//
// ADMIN METHODS START
// ADMIN - Add User
const addUser = async (request, response) => {
  const { name, email, height, weight, password } = request.body;
};

// ADMIN - Delete User
const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    let query = "delete from users where id=$1";
    let props = [id];

    const res = await execQuery(query, props);
    if (res.rowCount != 0) {
      response.status(200).send(
        JSON.stringify({
          Delete: "Success",
          message: "User Deleted",
        })
      );
      logger.info(`DB ADMIN Delete User- ${id} Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          Delete: "Failed",
          message: "User Not Found",
        })
      );
      logger.warn(`DB ADMIN Delete User- ${id} Failed, Does not Exist`);
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` DB Error- ${(id, e)} `);
  }
};

// ADMIN METHODS END

//
// Blog Method Started
// ADMIN - Used for creating DeathNews,Home Blog
const createBlog = async (request, response) => {
  const { title, content, category } = JSON.parse(request.body.form_data);
  const file = request.file;
  try {
    // console.log(request.role);
    if (request.userRole !== "admin") throw "Authorization error";

    let query =
      "insert into blog (title,content,category,image,imageType) values($1,$2,$3,$4,$5)";
    let props = [
      title,
      content,
      category,
      file ? file.buffer : null,
      file ? file.mimetype : null,
    ];

    const res = await execQuery(query, props);

    if (res.rowCount != 0) {
      response.status(200).send(
        JSON.stringify({
          blog: "Success",
          message: "Blog Added",
        })
      );
      logger.info(`DB ADMIN createBlog Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          blog: "Failed",
          message: "Error",
        })
      );
      logger.warn(`DB ADMIN createBlog Failed`);
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` Error ADMIN createBlog - ${e} `);
  }
};

// ADMIN+USER - Used for reading DeathNews,Home Blog
const getAllBlog = async (request, response) => {
  const { blogid, limit, date, offset, category, type } = request.body;

  // console.log(request.cookie.jwt)

  try {
    logger.info(`DB  getAllBlog Started ${offset}`);
    let query =
      "select * from  blog where category = $1 ORDER BY createdat DESC  limit $2  offset $3";
    let props = [category, limit, offset];

    if (type === "Single") {
      query = "select * from  blog where blogId =$1";
      props = [blogid];
    }
    const res = await execQuery(query, props);

    // query = process.env.query_getCount;

    const count = await execQueryNP("select count(*) from blog");

    response
      .status(200)
      // .send(res.rows);
      .send(JSON.stringify({ data: res.rows, meta: count.rows[0] }));
    logger.info(`DB  getAllBlog Completed`);
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );

    logger.error(` Error  getAllBlog - ${e} `);
  }
};

// ADMIN+USER - Used for reading Single DeathNews,Home Blog
const getSingleBlog = async (request, response) => {
  const blogId = parseInt(request.params.blogId);

  try {
    const client = await pool.connect();
    logger.info(`DB  getSingleBlog Started`);
    let query = "select * from  blog where blogId =$1";
    let props = [blogId];

    const res = await execQuery(query, props);
    if (res.rowCount != 0) {
      response.status(200).send(res.rows);
      logger.info(`DB  getSingleBlog Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          getSingleBlog: "Failed",
          message: "Blog not found",
        })
      );
      logger.warn(`getSingleBlog Failed, Does not Exist`);
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` getSingleBlog - ${e} `);
  }
};

// ADMIN - Used for deleting Single DeathNews,Home Blog
const deleteSingleBlog = async (request, response) => {
  const blogId = parseInt(request.params.blogId);

  try {
    logger.info(`DB  deleteSingleBlog Started`);

    let query = "delete from  blog where blogId =$1";
    let props = [blogId];

    const res = await execQuery(query, props);
    if (res.rowCount != 0) {
      response.status(200).send(
        JSON.stringify({
          status: "success",
          message: "Blog Deleted",
        })
      );
      logger.info(`DB  deleteSingleBlog Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          status: "Failed",
          message: "Blog not found",
        })
      );
      logger.warn(`deleteSingleBlog Failed, Does not Exist`);
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` deleteSingleBlog - ${e} `);
  }
};

// Blog METHODS END

// Common Methods Start
const getPincodeData = async (request, response) => {
  const pincode = parseInt(request.params.pincode);

  try {
    const client = await pool.connect();
    logger.info(`DB  getPincodeData Started`);

    const res = await client.query(
      "select * from pincodeMaster where pincode = $1",
      [pincode]
    );
    client.release();
    if (res.rowCount != 0) {
      response.status(200).send(res.rows);
      logger.info(`DB  getPincodeData Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          getPincodeData: "Failed",
          message: "Pincode Not Found",
        })
      );
      logger.warn(`getPincodeData Failed, Does not Exist`);
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` getPincodeData - ${e} `);
  }
};

const getFilterData = async (request, response) => {
  const filterName = request.params.filterName;

  try {
    logger.info(`DB  getFilterData Started`);
    let query = null;
    let props = null;
    if (filterName === "HomeArea") {
      query =
        "select distinct(homearea) from homeaddress where homearea != '' order by 1";
      props = [];
    }
    const res = await execQuery(query, props);
    if (res.rowCount != 0) {
      response.status(200).send(res.rows);
      logger.info(`DB  getFilterData Completed`);
    } else {
      response.status(400).send(
        JSON.stringify({
          getPincodeData: "Failed",
          message: "getFilterData Not Found",
        })
      );
      logger.warn(`getFilterData Failed, Does not Exist`);
    }
  } catch (e) {
    response.status(500).send(
      JSON.stringify({
        message: "DB ERROR",
      })
    );
    logger.error(` getFilterData - ${e} `);
  }
};
// Common Methods end

module.exports = {
  getAllFamily,
  getFamily,
  updateFamily,
  updateMobile,
  updatePP,
  deletePP,
  getFamilyMembers,
  deleteFamilyMember,
  createFamilyMember,
  getUserByMobile,
  deleteUser,
  createBlog,
  getAllBlog,
  getSingleBlog,
  deleteSingleBlog,
  getPincodeData,
  getFilterData,
};
