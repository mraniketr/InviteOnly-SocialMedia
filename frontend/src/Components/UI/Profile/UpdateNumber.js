import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import Textbox from "../Common/FormTextbox";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { mobileSchema } from "../Common/ValdationSchema";
import { apiFetch } from "../../../APIComponents/apiCalls";
import requestsURL from "../../../APIComponents/requests";
export default function UpdateNumber({ familyID, handleClose }) {
  const schema = yup.object().shape({
    oldmobile: mobileSchema,
    mobile2: mobileSchema,
    mobile: mobileSchema.test(
      "Mobile-Match",
      "Both Mobile Must match",
      (value) => watch("mobile2", "") === value
    ),
  });
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });
  const {
    formState: { errors },
    handleSubmit,
    watch,
  } = methods;

  const onSubmit = async (data) => {
    if (window.confirm("Are you sure to Save the changes?")) {
      const res = await apiFetch(
        requestsURL.familyDevice,
        JSON.stringify(data),
        "PUT"
      );
    }
    handleClose();
    handleClose();
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
            UIname="Family ID"
          />
          <Textbox
            type="text"
            defaultValue={null}
            readOnly={false}
            DBname="oldmobile"
            UIname="Old Login Mobile Number"
          />
          <p className="text-danger">{errors.oldmobile?.message}</p>

          <Textbox
            type="text"
            defaultValue={null}
            readOnly={false}
            DBname="mobile2"
            UIname="New Login Mobile Number"
          />
          <p className="text-danger">{errors.mobile2?.message}</p>

          <Textbox
            type="text"
            defaultValue={null}
            readOnly={false}
            DBname="mobile"
            UIname="Confirm New Login Mobile Number"
          />
          <p className="text-danger">{errors.mobile?.message}</p>

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
