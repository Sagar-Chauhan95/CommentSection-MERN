import './App.scss';
import avatar from './images/bozai.png';
import { useState, useRef, ChangeEvent, ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs/';
import { useCustomHook } from "./customHook";

export interface Post {
  rpid: number | string,
  user: {
    uid: string;
    avatar: string,
    uname: string;
  };

  content: string,
  ctime: string,
  like: number;
}

// current logged in user info
const user = {
  // userid
  uid: '30009257',
  // profile
  avatar,
  // username
  uname: 'John',
};

// Nav Tab
const tabs = [
  { type: 'hot', text: 'Top' },
  { type: 'newest', text: 'Newest' },
];

const App = () => {
  const { posts: displayPosts, setPosts: setDisplayPosts } = useCustomHook();
  const [ activePost, setActivePost ] = useState('hot');
  let [ postContent, setPostContent ] = useState<string>("");
  const [ focusTextarea, setFocusTextarea ] = useState<boolean>(false);

  // using useRef
  // const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [ highlightedPost, setHighlightedPost ] = useState<Post | null>(null);


  const deletePost = (ripd: number | string) => {
    setDisplayPosts([ ...displayPosts ].filter((post) => post.rpid !== ripd));

  };

  const sortPost = (type: string) => {
    setActivePost(type);

    if (type === 'hot') {
      setDisplayPosts(_.orderBy(displayPosts, 'like', 'desc'));
    } else {
      setDisplayPosts(_.orderBy(displayPosts, 'ctime', 'desc'));

    }
  };
  const handlePostEntry = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.currentTarget.value);

  };

  const makePost = (newComment: string) => {
    const newPost = {
      rpid: uuidv4(),
      user: {
        uid: '30009257',
        avatar,
        uname: 'John',
      },
      content: newComment,
      ctime: dayjs(Date.now()).format('MM-DD HH:mm'),
      like: 0,
    };

    setDisplayPosts([ ...displayPosts, newPost ]);
    setPostContent("");
    setFocusTextarea(true);

  };

  const increaseLike = (rpid: string | number) => {
    const updatedPost = displayPosts.map((post) => {
      if (post.rpid === rpid) {
        return { ...post, like: post.like + 1 };
      }

      return post;
    });

    setDisplayPosts(updatedPost);

  };

  return (
    <div className="app">
      {/* Nav Tab */ }
      <div className="reply-navigation">
        <ul className="nav-bar">
          <li className="nav-title">
            <span className="nav-title-text">Comments</span>
            {/* Like */ }
            <span className="total-reply">{ displayPosts.length }</span>
          </li>
          <li className="nav-sort">
            {/* highlight class name： active */ }

            { tabs.map((tab) =>
            (<span key={ tab.type }
              // 3rd way using className dependency
              className={ classNames('nav-item', { active: tab.type === activePost }) }
              onClick={ () => sortPost(tab.type) }> { tab.text } </span>)

            ) }
          </li>
        </ul>
      </div>

      <div className="reply-wrap">
        {/* comments */ }

        <div className="box-normal">
          {/* current logged in user profile */ }
          <div className="reply-box-avatar">
            <div className="bili-avatar">
              <img className="bili-avatar-img" src={ user.avatar } alt="Profile" />
            </div>
          </div>
          <div className="reply-box-wrap">
            {/* comment */ }
            <textarea onChange={ (e) => handlePostEntry(e) }

              value={ postContent }
              // ref={ textareaRef }
              className="reply-box-textarea"
              placeholder="tell something..."
              ref={ focusTextarea ? (textarea) => textarea && textarea.focus() : undefined }
            />
            {/* post button */ }
            <div className="reply-box-send" onClick={ () => makePost(postContent) }>
              <div className="send-text">post</div>
            </div>
          </div>
        </div>
        {/* comment list */ }
        { displayPosts.map((post) => (
          < Component1 post={ post } ondeletePost={ deletePost } onIncreaseLike={ increaseLike } />
        )) }
      </div>
    </div>
  );
};

type ComponentProps = {
  post: Post;
  ondeletePost: (rpid: number | string) => void;
  onIncreaseLike: (rpid: number | string) => void;

};

function Component1(props: ComponentProps) {
  const { post, ondeletePost, onIncreaseLike } = props;


  return (<div className="reply-list" key={ post.rpid }>
    {/* comment item */ }
    <div className="reply-item">
      {/* profile */ }
      <div className="root-reply-avatar">
        <div className="bili-avatar">
          <img
            className="bili-avatar-img"
            src={ post.user.avatar }
            alt=""
          />
        </div>
      </div>

      <div className={ classNames("content-wrap") }>
        {/* username */ /* className={ classNames('nav-item', { active: tab.type === activePost }) */ }
        <div className="user-info">
          <div className="user-name"> { post.user.uname } </div>
        </div>
        {/* comment content */ }
        <div className="root-reply">
          <span className="reply-content"> { post.content } </span>
          <div className="reply-info">
            {/* comment created time */ }
            <span className="reply-time">{ post.ctime }</span>
            {/* total likes */ }
            <span className="reply-time" onClick={ () => onIncreaseLike(post.rpid) }>Like:{ post.like }</span>
            { post.user.uid === user.uid && (<span className="delete-btn" onClick={ () => ondeletePost(post.rpid) }>
              Delete
            </span>) }

          </div>
        </div>
      </div>
    </div>
  </div>
  );

}

export default App;