import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import { useAuth0 } from "@auth0/auth0-react";
import "./Memebate.css";
import MemeBuilder from "./MemeBuilder";
import Mbreactions from "./Mbreactions";
import Challenge from "./Challenge";


function Memebate() {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({});
  const user = useAuth0();
  const [memeBuilderState, setMemeBuilderState] = useState(false);
  const [memebateList, setMemebateList]=useState([])
  const updateList= async (meme)=>{
    setLoading(true)
  let list=memebateList
  list.push(meme)
  setMemebateList(list)
    setLoading(false);
  }

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      setIsError(false);
      try {
        const resp = await axios.get(`/media/${id}`);
        console.log(resp);
        if (!ignore) setData(resp.data);
      } catch (error) {
        console.error(error);
        setIsError(true);
      }
      setLoading(false);
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [id]);
  useEffect(()=>{
    getMemebate()
  },[])
  const getMemebate=async()=>{
    const list=await axios.get(`/memebaters/${id}`);
    console.log(list)
    if(list){
      setMemebateList(list.data)
    }
  }
  const handleLike = (id, likes, email) => {
    console.log(id);
    try {
      axios
        .post("/media/likes/add", { id: id, like: likes + 1, email: email })
        .then((response) => {
          let object = data;
          object.likes++;
          updateReaction(object);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDislike = (id, dislikes, email) => {
    console.log(id);
    try {
      axios
        .post("/media/dislikes/add", {
          id: id,
          like: dislikes + 1,
          email: email,
        })
        .then((response) => {
          let object = data;
          object.dislikes++;
          updateReaction(object);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const updateReaction = (object, index) => {
    setLoading(true);
    setData(object);
    setLoading(false);
  };
  return (
    <div className="memebate">
      <div className="subject">
        <div className="title">
          <h1>{data.title}</h1>
          <div className="tags">
            <div className="tag-catfor">{data.category}</div>
            <div className="tag-catfor">{data.format}</div>
          </div>
        </div>
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${
            data?.debate?.indexOf("=") > -1
              ? data?.debate?.split("=")[1]
              : data.debate
          }`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <div className="reactions">
          <div className="reaction">
            <ThumbUpIcon
              onClick={() => handleLike(id, data.likes, user.email)}
            />
            <span className="reaction_count">{data.likes}</span>
          </div>
          <div className="reaction">
            <ThumbDownAltIcon
              onClick={() => handleDislike(id, data.dislikes, user.email)}
            />
            <span className="reaction_count">{data.dislikes}</span>
          </div>
        </div>
        <div className="synopsis">{data.synopsis}
        </div>
      </div>
      <div className="debate_responses">
        <div className="memebate_container">
      {!memeBuilderState && (
        <button className="btn" onClick={() => setMemeBuilderState(true)}>
          Memebate This
        </button>
      )}
      {memeBuilderState && <MemeBuilder mediaId={id} updateList={updateList} />}
        <div className="memebatelist">
          {
            memebateList?.map((memebate, index)=>{
              return(
                <div className="memebatelist_item" key={index}>
                  <Mbreactions data={memebate}/>
                  </div>
              )
            })
            
          }
          </div>
        </div>
        <div className="challenge_container">
          <Challenge media_id={id}/>
        </div>
        </div>
    </div>
  );
}

export default Memebate;
