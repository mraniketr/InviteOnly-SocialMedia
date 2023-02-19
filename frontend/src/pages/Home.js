import {
  Button,
  Card,
  DropdownButton,
  Spinner,
  Dropdown,
} from "react-bootstrap";
import configData from "../config.json";

import React, { useEffect, useState } from "react";
import * as backendAPI from "../APIComponents/apiCalls";
import requestsURL from "../APIComponents/requests";
import { Link } from "react-router-dom";
import BlogCard from "../Components/UI/Home/BlogCard";

export default function Home() {
  const [BlogOffset, setBlogOffset] = useState(0);
  const [metaCount, setmetaCount] = useState([]);
  const [removeLoadMore, setremoveLoadMore] = useState(false);
  const fetchLimit = configData.blogPageFetch;
  const [blogs, setBlogs] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const getBlogs = async () => {
    setIsLoading(true);
    const responseBlogs = await backendAPI.apiFetch(
      requestsURL.blog,
      JSON.stringify({
        limit: fetchLimit,
        date: null,
        offset: BlogOffset,
        category: 1,
        type: "All",
      }),
      "POST"
    );
    setIsLoading(false);

    setBlogs(responseBlogs.data);
    setmetaCount(Number(responseBlogs.meta?.count));
  };
  useEffect(() => {
    getBlogs();
  }, [BlogOffset]);

  useEffect(() => {
    if (BlogOffset + fetchLimit < metaCount) {
      setremoveLoadMore(false);
    } else {
      setremoveLoadMore(true);
    }
  }, [BlogOffset, metaCount]);

  function paginatinoRender() {
    let dropdown = [];
    let dropdownLimit =
      metaCount < fetchLimit ? 1 : Math.ceil(metaCount / fetchLimit);

    for (let i = 0; i < dropdownLimit; i++)
      dropdown.push(
        <Dropdown.Item key={i} onClick={() => setBlogOffset(fetchLimit * i)}>
          {i + 1}
        </Dropdown.Item>
      );
    return dropdown;
  }
  return (
    <div className="Home">
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <div className="BlogcardsWrap">
            {blogs ? (
              blogs.map((x, i) => (
                <div key={i}>
                  <BlogCard
                    image={x["image"]}
                    imagetype={x["imagetype"]}
                    title={x["title"]}
                    blogid={x["blogid"]}
                    content={x["content"]}
                    date={x["createdat"]}
                  />
                </div>
              ))
            ) : (
              <p className="text-danger">No Results Found</p>
            )}
          </div>
          <div className="paginationWrap">
            <Button
              variant="success"
              onClick={() => setBlogOffset(BlogOffset + fetchLimit)}
              disabled={removeLoadMore}
            >
              Next
            </Button>
            <DropdownButton id="dropdown-basic-button" title="Page">
              {paginatinoRender()}
            </DropdownButton>
            <Button
              variant="warning"
              onClick={() => setBlogOffset(BlogOffset - fetchLimit)}
              disabled={BlogOffset > 0 ? false : true}
            >
              Previous
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
