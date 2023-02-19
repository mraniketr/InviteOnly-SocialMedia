import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useForm, FormProvider } from "react-hook-form";
import { apiFetch } from "../../../APIComponents/apiCalls";
import requestsURL from "../../../APIComponents/requests";
import FormDropDown from "../Common/FormDropDown";
import Textbox from "../Common/FormTextbox";
import configData from "../../../config.json";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import imageCompression from "browser-image-compression";

import {
  dob,
  mobileSchema,
  onlyAlphabets,
  onlyAlphabetsNA,
  pinSchema,
} from "../Common/ValdationSchema";
import FileSelectBox from "../Common/FormFileSelect";
export default function AddMember({ familyID, handleClose }) {
  const schema = yup.object().shape({
    relation: onlyAlphabets.length(3),
    // dob: dob,
    membername: onlyAlphabets,
    relation: onlyAlphabets,
    education: onlyAlphabetsNA,
    specialization: onlyAlphabetsNA,
    // sankhe: onlyAlphabets,
    mobile: mobileSchema,
  });

  const [alertmessage, setalertMessage] = useState();
  const methods = useForm({ mode: "all", resolver: yupResolver(schema) });
  const {
    formState: { errors },
    handleSubmit,
    reset,
  } = methods;
  const onSubmit = async (data) => {
    if (window.confirm("Are you sure to Save the changes?")) {
      // console.log(data);
      var formData = new FormData();
      // Image COmpression

      // console.log(data.pp);
      if (data.pp.length > 0) {
        formData.append(
          "pp",
          await imageCompression(data.pp["0"], configData.PpCompressionOptions)
        );
      }
      formData.append("form_data", JSON.stringify(data));
      const res = await fetch(requestsURL.familyMembers, {
        body: formData,
        method: "POST",
        credentials: "include",
      });
      const resData = await res.json();
      // console.log(resData);
      if (res.status === 500) {
        setalertMessage(resData.message);
      }
      if (res.status === 200) {
        handleClose();
        handleClose();
      }
    }
  };
  return (
    <div>
      {alertmessage ? <Alert variant="danger">{alertmessage}</Alert> : ""}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Textbox
            type="hidden"
            defaultValue={familyID}
            readOnly={true}
            DBname="familyid"
            UIname="Family ID"
          />

          <Textbox
            type="text"
            defaultValue={null}
            readOnly={false}
            DBname="membername"
            UIname="Member Name"
          />
          <p className="text-danger">{errors.membername?.message}</p>
          <Textbox
            type="text"
            defaultValue={null}
            readOnly={false}
            DBname="dob"
            UIname="Date of birth"
          />
          <p className="text-danger">{errors.dob?.message}</p>
          {/* <Textbox
            type="text"
            defaultValue={null}
            readOnly={false}
            DBname="relation"
            UIname="Relation"
          /> */}
          <FormDropDown
            defaultValue={null}
            values={configData.relation}
            DBname="relation"
            UIname="Relation (Use Self only for Family Head)"
          />
          <p className="text-danger">{errors.relation?.message}</p>
          <Textbox
            type="text"
            defaultValue={null}
            readOnly={false}
            DBname="education"
            UIname="Education (Optional)"
          />
          <p className="text-danger">{errors.education?.message}</p>
          <Textbox
            type="text"
            defaultValue={null}
            readOnly={false}
            DBname="specialization"
            UIname="Specialization (Optional)"
          />
          <p className="text-danger">{errors.specialization?.message}</p>
          <Textbox
            type="text"
            defaultValue={null}
            readOnly={false}
            DBname="mobile"
            UIname="Mobile No. (Optional)"
          />
          <p className="text-danger">{errors.mobile?.message}</p>
          <Textbox
            type="text"
            defaultValue={null}
            readOnly={false}
            DBname="sankhe"
            UIname="Sankhe"
          />
          <p className="text-danger">{errors.sankhe?.message}</p>

          <FileSelectBox
            type="file"
            defaultValue={null}
            readOnly={false}
            DBname="pp"
            UIname={"Member Image"}
          />

          <button
            type="submit"
            className=" m-2 p-2 bd-highlight btn btn-warning profile-buttons "
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
