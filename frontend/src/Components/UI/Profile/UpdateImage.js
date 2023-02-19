import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Textbox from "../Common/FormTextbox";
import requestsURL from "../../../APIComponents/requests";
import { apiFetch, apiFetchNoBody } from "../../../APIComponents/apiCalls";
import config from "../../../config.json";

export default function UpdateImage({ familyID, handleClose }) {
  const methods = useForm();
  const { register, handleSubmit } = methods;
  const [error, setError] = useState();
  const onSubmit = async (data) => {
    // const formData = new FormData();
    console.log(data.pp["0"]);

    if (window.confirm("Are you sure to Save the changes?")) {
      try {
        if (data.pp["0"].size > config.MPFileLimitPP) {
          throw "File size Limit exceeded";
        }
        if (!config.MPFileTypePP.includes(data.pp["0"].type)) {
          throw "Invalid image File type";
        }

        var formData = new FormData();
        formData.append("pp", data.pp["0"]);
        formData.append("familyid", data.familyid);

        await fetch(requestsURL.familyPP, {
          method: "PUT",
          // headers: { "Content-Type": "multipart/form-data" },
          body: formData,
          credentials: "include",
        });

        handleClose();
        handleClose();
      } catch (e) {
        setError(e);
      }
    }
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Textbox
            type="hidden"
            defaultValue={familyID}
            readOnly={true}
            DBname="familyid"
            // UIname="Family ID"
          />
          <input
            className="form-control form-control-lg"
            id="formFileLg"
            type="file"
            name="pp"
            required={true}
            {...methods.register("pp")}
          />
          <p className="text-danger">{error}</p>
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
