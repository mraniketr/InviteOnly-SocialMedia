
#DB Queries
#AUTH
query_getFamilyId = select familyid,role from family where loginmobile=$1

#PROFILE
query_getIndividualFamily=select ba.businessaddress,ba.businessarea,ba.businesscity,ba.businessmobile,ba.businessname,ba.businesspincode,ba.businessstate,f.familyid,ha.homeaddress,ha.homearea,ha.homecity,ha.homemobile,ha.homepincode,ha.homestate,f.website,f.emailid,fm.membername from family f left join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid left join homeaddress ha on ha.familyid = f.familyid left join businessaddress ba on ba.familyid = f.familyid where f.familyid=$1
query_updateFamilyTable = update family set website=$1,emailid=$2 where familyid=$3
query_updateHomeAddressTable = update homeaddress set homeaddress=$1,homemobile=$2,homepincode=$3,homecity=$4,homearea=$5,homestate=$6 where familyid=$7
query_updateBusinessAddressTable = update businessaddress set businessaddress=$1,businessmobile=$2,businesspincode=$3,businesscity=$4,businessarea=$5,businessstate=$6,businessname=$7 where familyid=$8
query_insertBusinessAddressTable = insert into businessaddress (businessaddress,businessmobile,businesspincode,businesscity,businessarea,businessstate,businessname,familyid) values($1,$2,$3,$4,$5,$6,$7,$8)
query_updatemobile = update family  set loginmobile=$2 where familyid=$3 and loginmobile=$1 

#Family Members
query_getFamilyMembers = select * from familymember where familyid=$1
query_deleteMember = delete from familymember where memberid=$1 and familyid=$2
query_createMemberHead = insert into familyMember ( familyId, memberId, membername , relation , DOB , education , specialization , sankhe, mobile,image,imageType,lastUpdatedAt ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP) 
query_createMember = insert into familyMember ( familyId, membername , relation , DOB , education , specialization , sankhe, mobile ,image,imageType,lastUpdatedAt) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP)

#family dp -not used curr
query_updateImage = update family set image=$1, imageName=$2,imageSize=$3,imageType=$4, lastUpdatedt= CURRENT_TIMESTAMP where familyid=$5
query_deleteImage = update family set image=null, imageName=null,imageSize=null,imageType=null, lastUpdatedt= CURRENT_TIMESTAMP where familyid=$1

#DIRECTORY
query_getAllFamily= select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid  order by fm.membername asc limit $1  offset $2
query_getAllFamily_Alpha_sort =  select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where upper(fm.membername) like $3 order by fm.membername asc limit $1  offset $2
query_getAllFamily_Filter_familyid= select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where f.familyid = $3 order by fm.membername asc limit $1  offset $2
query_getAllFamily_Filter_membername = select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where lower(fm.membername) like lower($3) order by fm.membername asc limit $1  offset $2
query_getAllFamily_Filter_mobile = select f.familyid,fm.image,fm.imagetype,fm.membername,fm.mobile,ha.homeaddress, ha.homearea,ha.homepincode ,ha.homestate from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where fm.mobile = $3 order by fm.membername asc limit $1  offset $2
query_adminDeleteUser = delete from users where id=$1
#Blog
query_admin_addBlog = insert into blog (title,content,category,image,imageType) values($1,$2,$3,$4,$5)
query_admin_deleteBlog = delete from  blog where blogId =$1

query_getAllBlogs = select * from  blog where category = $1 ORDER BY createdat DESC  limit $2  offset $3
query_getSingleBlog = select * from  blog where blogId =$1

#common
query_getCountBlog = select count(*) from blog
query_getCountFamily = select count(*) from family
query_getCountFamily_AlphaSort  = select count(*) from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid  where upper(fm.membername) like $1
query_count_search_familyid= select count(*) from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where fm.familyid = $1 
query_count_search_membername = select count(*) from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where lower(fm.membername) like lower($1) 
query_count_search_mobile = select count(*) from family f inner join familymember fm on f.headid=fm.memberid and f.familyid=fm.familyid inner join homeaddress ha on ha.familyid = f.familyid where fm.mobile = $1 
query_FilterHomeAddress =select distinct(homearea) from homeaddress order by 1

query_getPincodeData = select * from pincodeMaster where pincode = $1