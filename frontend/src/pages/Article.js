import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import formatDate from "../Components/Utility/TimeStamp";
import * as backendAPI from "../APIComponents/apiCalls";
import requestsURL from "../APIComponents/requests";
export default function Article(props) {
  let { id } = useParams();
  const [article, setArticle] = useState(null);

  const [loading, setIsLoading] = useState(true);

  const getBlogs = async () => {
    setIsLoading(true);
    try {
      setArticle(props.location.content.data);
    } catch {
      const responseBlogs = await backendAPI.apiFetch(
        requestsURL.blog,
        JSON.stringify({
          blogid: id,
          type: "Single",
        }),
        "POST"
      );

      setArticle(responseBlogs[0]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div className="article">
      {loading ? (
        ""
      ) : (
        <div>
          {article.image ? (
            <img
              src={`data:${article.imagetype}};base64,${Buffer.from(
                article.image.data
              ).toString("base64")}`}
            />
          ) : (
            ""
          )}
          <div className="contentWrap">
            <h1 className="title">{article.title}</h1>
            <h6 className="date">{formatDate(article.date)}</h6>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>
      )}
    </div>
  );
}
