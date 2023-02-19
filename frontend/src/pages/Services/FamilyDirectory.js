import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  Button,
  ButtonGroup,
  Card,
  DropdownButton,
  Spinner,
  Dropdown,
  Form,
} from "react-bootstrap";
// React hook form
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  id,
  mobileSchema,
  mobileSchemaReq,
  onlyAlphabets,
  onlyAlphabetsNA,
} from "../../Components/UI/Common/ValdationSchema";

// Congig
import configData from "../../config.json";
import * as backendAPI from "../../APIComponents/apiCalls";
import requestsURL from "../../APIComponents/requests";
import FamilyCard from "../../Components/UI/Services/FamilyCard";
import FormDropDown from "../../Components/UI/Common/FormDropDown";
import Textbox from "../../Components/UI/Common/FormTextbox";
export default function FamilyDirectory() {
  const schema = yup.object().shape({
    membername: onlyAlphabets,
    mobile: mobileSchemaReq,
    familyid: id,
  });

  const methods = useForm({ mode: "all", resolver: yupResolver(schema) });
  const {
    handleSubmit,
    formState: { errors },
    watch,
    unregister,
    reset,
  } = methods;

  const watchSearchForm = watch();

  const onSubmit = (data) => {
    delete data["searchBy"];
    let key = {};
    if (data.membername) key["membername"] = data.membername + "%";
    else if (data.familyid) key["familyid"] = data.familyid;
    // setShowAdvFilter(false);
    else key["mobile"] = data.mobile;
    delete data[Object.keys(key)[0]];
    console.log(showAdvFilter);
    setDataFilter({
      advFilter: {
        data: { search: key, filter: data },
        filterBy: {
          area:
            watchSearchForm.searchBy === "Family Head Name" && showAdvFilter,
        },
      },
    });
    setOffset(0);
  };

  const [familyCards, setfamilyCards] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [metaCount, setmetaCount] = useState(0);
  const [Offset, setOffset] = useState(0);
  const [removeLoadMore, setremoveLoadMore] = useState(false);
  const [dataFilter, setDataFilter] = useState({});
  const [showAdvFilter, setShowAdvFilter] = useState(false);
  const [advCheckBox, setAdvCheckBox] = useState([]);
  const fetchLimit = configData.FamilyDirPageFetch;
  const getfamilyCards = async () => {
    setIsLoading(true);
    const responsefamilyCards = await backendAPI.apiFetch(
      requestsURL.familyProfile,
      JSON.stringify({
        limit: fetchLimit,
        dataFilter: dataFilter,
        offset: Offset,
        category: 1,
        type: "All",
      }),
      "POST"
    );
    setIsLoading(false);
    setmetaCount(Number(responsefamilyCards.meta?.count));
    setfamilyCards(responsefamilyCards.data);

    // console.log(Offset);
  };
  useEffect(() => {
    getfamilyCards();
    console.log(dataFilter);
  }, [Offset, dataFilter]);

  useEffect(() => {
    if (Offset + fetchLimit < metaCount) {
      setremoveLoadMore(false);
    } else {
      setremoveLoadMore(true);
    }
  }, [Offset, metaCount]);

  const initialRender = useRef(true);
  useEffect(async () => {
    if (
      initialRender.current ||
      showAdvFilter === false ||
      advCheckBox.length > 0
    ) {
      initialRender.current = false;
    } else {
      const resHomeAreaFilter = await backendAPI.apiFetchNoBody(
        requestsURL.common + "filter/HomeArea",
        "GET"
      );
      setAdvCheckBox(resHomeAreaFilter);
    }
  }, [showAdvFilter]);
  useEffect(() => {
    unregister("membername");
    unregister("familyid");
    unregister("mobile");
  }, [watchSearchForm.searchBy]);
  function buttonGroupRender() {
    let buttonGroup = [];
    for (let i = 0; i < 26; i++)
      buttonGroup.push(
        <Button
          key={i}
          variant="secondary"
          onClick={() => {
            setDataFilter({ charFilter: String.fromCharCode(65 + i) });
            setOffset(0);
          }}
        >
          {String.fromCharCode(65 + i)}
        </Button>
      );

    buttonGroup.push(
      <Button
        variant="danger"
        onClick={() => {
          setOffset(0);
          setDataFilter({});
        }}
      >
        Clear Filter
      </Button>
    );
    return buttonGroup;
  }

  function paginatinoRender() {
    let dropdown = [];
    let dropdownLimit =
      metaCount < fetchLimit ? 1 : Math.ceil(metaCount / fetchLimit);

    for (let i = 0; i < dropdownLimit; i++)
      dropdown.push(
        <Dropdown.Item key={i} onClick={() => setOffset(fetchLimit * i)}>
          {i + 1}
        </Dropdown.Item>
      );
    return dropdown;
  }
  return (
    <div className="FamilyDirectory">
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Filter by Alphabets</Accordion.Header>
              <Accordion.Body>
                <ButtonGroup aria-label="Basic example">
                  {buttonGroupRender()}
                </ButtonGroup>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Advance Search</Accordion.Header>
              <Accordion.Body>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormDropDown
                      defaultValue={null}
                      values={configData.familySearchMethods}
                      DBname="searchBy"
                      UIname="Search Family by"
                    />
                    {watchSearchForm.searchBy === "Family Head Name" ? (
                      <div>
                        <Textbox
                          type="text"
                          defaultValue={null}
                          readOnly={false}
                          DBname="membername"
                          UIname="Member Name"
                        />
                        <p className="text-danger">
                          {errors.membername?.message}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    {watchSearchForm.searchBy === "Mobile Number" ? (
                      <div>
                        <Textbox
                          type="text"
                          defaultValue={null}
                          readOnly={false}
                          DBname="mobile"
                          UIname="Mobile Number"
                        />
                        <p className="text-danger">{errors.mobile?.message}</p>
                      </div>
                    ) : (
                      ""
                    )}
                    {watchSearchForm.searchBy === "Family ID" ? (
                      <div>
                        <Textbox
                          type="text"
                          defaultValue={null}
                          readOnly={false}
                          DBname="familyid"
                          UIname="Family ID"
                        />
                        <p className="text-danger">
                          {errors.familyid?.message}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="advFilterButton">
                      <Button type="submit" variant="success">
                        Submit
                      </Button>

                      <Button
                        variant={!showAdvFilter ? "primary" : "danger"}
                        onClick={() => {
                          setShowAdvFilter(!showAdvFilter);
                        }}
                        disabled={
                          watchSearchForm.searchBy !== "Family Head Name"
                        }
                      >
                        {!showAdvFilter ? "Add Filter" : "Remove Filter"}
                      </Button>
                    </div>
                    {showAdvFilter &&
                    watchSearchForm.searchBy === "Family Head Name" ? (
                      <div className="AdvFilterCheckBox">
                        {advCheckBox &&
                          advCheckBox.map((x, i) => (
                            <Form.Check
                              type={"checkbox"}
                              id={`default-checkbox`}
                              label={x.homearea}
                              key={i}
                              {...methods.register(`${x.homearea}`)}
                            />
                          ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </form>
                </FormProvider>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="famCardsWrap">
            {familyCards ? (
              familyCards.map((x, i) => (
                <div key={i}>
                  <FamilyCard familydata={x} />
                </div>
              ))
            ) : (
              <p className="text-danger">No Results Found</p>
            )}
          </div>
          <div className="paginationWrap">
            <Button
              variant="success"
              onClick={() => setOffset(Offset + fetchLimit)}
              disabled={removeLoadMore}
            >
              Next
            </Button>
            <DropdownButton id="dropdown-basic-button" title="Page">
              {paginatinoRender()}
            </DropdownButton>
            <Button
              variant="warning"
              onClick={() => setOffset(Offset - fetchLimit)}
              disabled={Offset > 0 ? false : true}
            >
              Previous
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
