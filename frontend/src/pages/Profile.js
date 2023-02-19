import React, { useEffect, useState } from "react";
import requestsURL from "../APIComponents/requests";
import cookies from "../APIComponents/cookieMaker";
import * as backendAPI from "../APIComponents/apiCalls";
import { FaUser } from "react-icons/fa";
import { useForm, FormProvider } from "react-hook-form";
import Textbox from "../Components/UI/Common/FormTextbox";
import ModalX from "../Components/UI/Profile/ModalX";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  mobileSchema,
  onlyAlphabets,
  pinSchema,
} from "../Components/UI/Common/ValdationSchema";
import FormDropDown from "../Components/UI/Common/FormDropDown";
import data from "../Components/UI/Common/dropdownData.json";
import { Accordion } from "react-bootstrap";
import FamilyPdf from "../Components/Utility/PdfDownload";

export default function Profile(props) {
  const schema = yup.object().shape({
    emailid: yup.string().email(),
    website: yup.string(),
    businesspincode: pinSchema,
    businessarea: onlyAlphabets,
    businesscity: onlyAlphabets,
    businessstate: onlyAlphabets,
    businessmobile: mobileSchema,
    homemobile: mobileSchema,
    homepincode: pinSchema.required(),
    homearea: onlyAlphabets,
    homecity: onlyAlphabets,
    homestate: onlyAlphabets,
  });
  const methods = useForm({ mode: "all", resolver: yupResolver(schema) });
  const {
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = methods;

  // console.log(errors);
  const [profile, setProfile] = useState({});
  const [members, setMembers] = useState(false);
  const [familyPdf, setfamilyPdf] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [isFamilyAdmin, setIsFamilyAdmin] = useState(false);
  const [editmode, setEditMode] = useState(true); //false to make form editable
  const [editbuttonName, seteditbuttonName] = useState("Edit Profile");
  const [addBusiness, setaddBusiness] = useState(false);
  const [show, setShowModal] = useState(false);
  const [modalTitle, setmodalTitle] = useState("");
  const [modalAction, setModalAction] = useState(0);
  const [alertmessage, setalertMessage] = useState();
  const [refresh, setRefresh] = useState(0);

  const cbShow = () => {
    setShowModal(false);
    setRefresh(refresh + 1); //to load the latest data
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you wish to Logout?")) {
      const response = await backendAPI.apiFetchNoBody(
        requestsURL.logout,
        "POST"
      );

      if (response.login === 0) {
        cookies.remove("isLoggedIn");
        cookies.remove("family_id");
        cookies.remove("otp_session_ID");
        window.location = "/login";
      }
    }
  };

  const getData = async () => {
    const pFID = props.location.family_id;
    console.log(pFID);
    const cFID = cookies.get("family_id");
    const family_id = pFID ? pFID : cFID;
    if (family_id === cFID) {
      setIsFamilyAdmin(true);
    }

    const responseP = await backendAPI.apiFetchNoBody(
      requestsURL.familyProfile + family_id,
      "GET"
    );
    setProfile(responseP[0]);
    const responseF = await backendAPI.apiFetchNoBody(
      requestsURL.familyMembers + family_id,
      "GET"
    );
    if (responseF.message != "FamilyMembers Not Found") {
      setMembers(responseF);
    } else {
      setMembers(false);
    }

    console.log(responseP[0]);
    console.log(responseF);

    // console.log(data);
    setisLoading(false);
  };

  const onSubmit = async (data) => {
    if (window.confirm("Are you sure to Save the changes?")) {
      data["newBusiness"] = addBusiness;
      await backendAPI.apiFetch(
        requestsURL.familyProfile,
        JSON.stringify(data),
        "PUT"
      );
      setEditMode(true);
      seteditbuttonName("Edit Profile");
      setRefresh(refresh + 1);
      // reset();
    }
  };

  function handleEditmodeOn(e) {
    e.preventDefault();
    setEditMode(false);
    seteditbuttonName("Save?");
  }

  useEffect(() => {
    let abortController = new AbortController();

    setisLoading(true);
    getData();
    return () => {
      abortController.abort();
    };
  }, [refresh]);

  return (
    <div className="family-profile">
      <ModalX
        cshow={show}
        cbShow={cbShow}
        modalTitle={modalTitle}
        familyID={profile.familyid}
        modalAction={modalAction}
        alertmessage={alertmessage}
      />
      {!isLoading ? (
        <div>
          <FormProvider {...methods}>
            <form
              className=" profile-form"
              onSubmit={editmode ? handleEditmodeOn : handleSubmit(onSubmit)}
            >
              {isFamilyAdmin ? (
                <div className="d-flex-row ">
                  <div className="d-flex justify-content-evenly ">
                    <button
                      type="submit"
                      className=" m-2 p-2 bd-highlight btn btn-warning profile-buttons "
                      // onClick={handleEditmodeOn}
                    >
                      {editbuttonName}
                    </button>
                    {editmode ? (
                      <button
                        className="m-2 p-2 bd-highlight btn btn-secondary profile-buttons"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    ) : (
                      ""
                    )}
                    {editmode ? (
                      ""
                    ) : (
                      <button
                        className="m-2 p-2 bd-highlight btn btn-secondary profile-buttons"
                        onClick={(e) => {
                          // e.preventDefault();
                          // window.location = "/profile";
                          setEditMode(true);
                          seteditbuttonName("Edit Profile");
                          setaddBusiness(false);

                          reset();
                          // setRefresh(refresh + 1);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  {editmode ? (
                    <div className="d-flex justify-content-evenly">
                      <button
                        className="profile-buttons m-2 p-2 bd-highlight btn btn-warning "
                        className="m-2 p-2 btn btn-danger bd-highlight profile-buttons"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowModal(true);
                          setmodalTitle(" Update Login Mobile number");
                          setModalAction(0);
                          setalertMessage(
                            "Adding an incorrect mobile number will delete this profile"
                          );
                        }}
                      >
                        Update Login Mobile
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              {/* <div className="d-flex justify-content-evenly">
                {image ? (
                  <img
                    className="ppCenterCropped"
                    src={`data:image/png;base64,${Buffer.from(
                      profile.image.data
                    ).toString("base64")}`}
                    // width="100px"
                    // height="100px"
                  />
                ) : (
                  <FaUser size="5rem" color="grey" />
                )}
                <div
                  style={{ display: "flex", flexDirection: "column" }}
                  className="align-self-center"
                >
                  
                  {isFamilyAdmin && image ? (
                    <button
                      type="submit"
                      className=" m-2 p-2 bd-highlight btn btn-danger profile-buttons "
                      onClick={async (e) => {
                        e.preventDefault();
                        await backendAPI.apiFetchNoBody(
                          requestsURL.familyPP,
                          "DELETE"
                        );
                        setImage(false);
                      }}
                    >
                      Remove current image
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div> */}
              {editmode ? (
                <div className="text-center">
                  <h1 className="text-center m-2">{profile.membername}</h1>
                  <h6 className="text-center m-2">
                    Family ID - {profile.familyid}
                  </h6>
                  <button
                    className="m-2 p-2 btn btn-warning bd-highlight profile-buttons"
                    onClick={(e) => {
                      e.preventDefault();
                      setfamilyPdf(true);
                    }}
                  >
                    Share Family
                  </button>
                  {familyPdf ? (
                    <FamilyPdf profile={profile} members={members} />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              <Textbox
                type="hidden"
                defaultValue={profile.familyid}
                readOnly={true}
                DBname="familyid"
                UIname="Family ID"
              />
              <Textbox
                type="text"
                defaultValue={profile.emailid}
                readOnly={editmode}
                DBname="emailid"
                UIname="Email ID"
              />
              <p className="text-danger">{errors.emailid?.message}</p>
              <Textbox
                type="text"
                defaultValue={profile.website}
                readOnly={editmode}
                DBname="website"
                UIname="Website"
              />
              <p className="text-danger">{errors.website?.message}</p>
              {profile.businessname == null && !editmode ? (
                <button
                  style={{ display: addBusiness ? "none" : "block" }}
                  className="m-2 p-2 btn btn-warning bd-highlight profile-buttons"
                  onClick={(e) => {
                    e.preventDefault();
                    setaddBusiness(true);
                  }}
                >
                  Add Business to profile
                </button>
              ) : (
                ""
              )}

              {profile.businessname || addBusiness ? (
                <div>
                  <h2 className="text-center">Business Details</h2>
                  <Textbox
                    type="text"
                    defaultValue={profile.businessname}
                    readOnly={editmode}
                    DBname="businessname"
                    UIname="Name"
                  />
                  <p></p>
                  <Textbox
                    type="text"
                    defaultValue={profile.businessaddress}
                    readOnly={editmode}
                    DBname="businessaddress"
                    UIname="Address"
                  />
                  <p></p>
                  <Textbox
                    type="text"
                    defaultValue={profile.businessarea}
                    readOnly={editmode}
                    DBname="businessarea"
                    UIname="Area"
                  />

                  <p className="text-danger">{errors.businessarea?.message}</p>

                  <Textbox
                    type="text"
                    defaultValue={profile.businesscity}
                    readOnly={editmode}
                    DBname="businesscity"
                    UIname="City"
                  />
                  <p className="text-danger">{errors.businesscity?.message}</p>

                  <Textbox
                    type="text"
                    defaultValue={profile.businessstate}
                    readOnly={editmode}
                    DBname="businessstate"
                    UIname="State"
                  />
                  <p className="text-danger">{errors.businessstate?.message}</p>
                  <Textbox
                    type="text"
                    defaultValue={profile.businesspincode}
                    readOnly={editmode}
                    DBname="businesspincode"
                    UIname="Pincode"
                  />
                  <p className="  text-danger">
                    {errors.businesspincode?.message}
                  </p>
                  <Textbox
                    type="text"
                    defaultValue={profile.businessmobile}
                    readOnly={editmode}
                    DBname="businessmobile"
                    UIname="Contact"
                  />
                  <p className="text-danger">
                    {errors.businessmobile?.message}
                  </p>
                </div>
              ) : (
                ""
              )}
              <h2 className="text-center">Home Details</h2>
              <Textbox
                type="text"
                defaultValue={profile.homeaddress}
                readOnly={editmode}
                DBname="homeaddress"
                UIname="Address"
              />
              <p></p>
              <Textbox
                type="text"
                defaultValue={profile.homearea}
                readOnly={editmode}
                DBname="homearea"
                UIname="Area"
              />
              <p className="text-danger">{errors.homearea?.message}</p>
              <Textbox
                type="text"
                defaultValue={profile.homecity}
                readOnly={editmode}
                DBname="homecity"
                UIname="City"
              />
              <p className="text-danger">{errors.homecity?.message}</p>

              <Textbox
                type="text"
                defaultValue={profile.homestate}
                readOnly={editmode}
                DBname="homestate"
                UIname="State"
              />
              <p className="text-danger">{errors.homestate?.message}</p>

              <Textbox
                type="text"
                defaultValue={profile.homepincode}
                readOnly={editmode}
                DBname="homepincode"
                UIname="Pincode"
              />
              <p className="text-danger">{errors.homepincode?.message}</p>
              <Textbox
                type="text"
                defaultValue={profile.homemobile}
                readOnly={editmode}
                DBname="homemobile"
                UIname="Contact"
              />
              <p className="text-danger">{errors.homemobile?.message}</p>
            </form>
          </FormProvider>

          {editmode ? (
            <div className="text-center">
              <h2 className="text-center">Family members</h2>
              {isFamilyAdmin ? (
                <div>
                  <button
                    className="m-2 p-2 btn btn-warning bd-highlight profile-buttons"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowModal(true);
                      setmodalTitle(" Add New Family Member");
                      setModalAction(2);
                      setalertMessage();
                    }}
                  >
                    Add New Family Member
                  </button>
                  <p className="text-danger text-center">
                    To Edit a member Delete them first, and Add a New family
                    member !!
                  </p>
                </div>
              ) : (
                ""
              )}

              {members &&
                members.map((member) => {
                  return (
                    <Accordion key={member.memberid} className="profile-form ">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header className="text-center">
                          <div>
                            <b>Name</b>
                            {member.membername}
                          </div>
                          <div>
                            <b>Relation</b>
                            {member.relation}
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          {member.image ? (
                            <img
                              className="ppCenterCropped"
                              src={`data:${
                                member.imagetype
                              }};base64,${Buffer.from(
                                member.image.data
                              ).toString("base64")}`}
                              // width="100px"
                              // height="100px"
                            />
                          ) : (
                            <FaUser size="5rem" color="grey" />
                          )}
                          <table
                            key={member.memberid}
                            className="table table-bordered mb-5 members-table"
                          >
                            <tbody>
                              <tr>
                                <th>Name</th>
                                <td>
                                  <b>{member.membername}</b>
                                </td>
                              </tr>
                              <tr>
                                <th>Relation</th>
                                <td>{member.relation}</td>
                              </tr>
                              {member.dob && (
                                <tr>
                                  <th>DOB</th>

                                  <td>{member.dob?.substring(0, 10)}</td>
                                </tr>
                              )}
                              {member.education && (
                                <tr>
                                  <th>Education</th>
                                  <td>{member.education}</td>
                                </tr>
                              )}
                              {member.specialization && (
                                <tr>
                                  <th>Specialization</th>
                                  <td>{member.specialization}</td>
                                </tr>
                              )}
                              {member.mobile && (
                                <tr>
                                  <th>Mobile</th>
                                  <td>{member.mobile}</td>
                                </tr>
                              )}
                              {member.sankhe && (
                                <tr>
                                  <th>Sankhe</th>
                                  <td>{member.sankhe}</td>
                                </tr>
                              )}
                              {isFamilyAdmin ? (
                                <tr>
                                  <th>Manage Member</th>
                                  <td>
                                    <button
                                      className="bd-highlight btn btn-danger profile-buttons"
                                      onClick={async (e) => {
                                        e.preventDefault();
                                        if (
                                          window.confirm(
                                            "Are you sure to Delete this member?"
                                          )
                                        ) {
                                          await backendAPI.apiFetch(
                                            requestsURL.familyMembers,
                                            JSON.stringify({
                                              memberid: `${member.memberid}`,
                                            }),
                                            "DELETE"
                                          );
                                          setRefresh(refresh + 1);
                                        }
                                      }}
                                    >
                                      Delete Member
                                    </button>
                                  </td>
                                </tr>
                              ) : (
                                ""
                              )}
                            </tbody>
                          </table>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  );
                })}
            </div>
          ) : (
            <p className="text-info text-center">
              Save/Cancel this form to manage family members
            </p>
          )}
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
