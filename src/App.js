import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import { InstagramEmbed } from 'react-social-media-embed';
import Sidenav from './Sidenav';
import Suggestions from './Suggestions';




function getModalStyle() {
  const top = 50 ;
  const left = 50;
  
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%) `,
  };
  
  }
  
  const useStyles = makeStyles ((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows [5],
      padding: theme.spacing(2, 4, 3),
  
  },
  
  }));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in
        console.log(authUser);
        setUser(authUser);


       } else{
        //user logged out
        setUser(null);
      }
      
    })

    return () => {
      //perform some clean up actions
      unsubscribe();
    }
  },[user, username]);

  //useEffect - runs a piece of code on a specific condition

  useEffect(() => {
    //code goes here
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //everytime a new post is added, this code fire off
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));

    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile ({
      displayName: username
    })
  })
  .catch((error) => alert(error.message));
  setOpen(false);

  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
  
    setOpenSignIn(false);
  }  

  return (
    <div className="app">


      <Sidenav></Sidenav>

      <Modal
       open={open}
       onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}> 
        <form className='app__signup'>
        <center>
          <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          />
           </center> 
           <Input
           type="text"
           placeholder="username"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
           /> 
           <Input
           placeholder="email"
           type="text"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           />
           <Input
           placeholder="password"
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           />
           <Button type="submit" onClick={signUp}>Sign Up</Button>
           </form>
         
       
        </div>
        
      </Modal>

      <Modal
       open={openSignIn}
       onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}> 
        <form className='app__signup'>
        <center>
          <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          />
           </center> 
           <Input
           placeholder="email"
           type="text"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           />
           <Input
           placeholder="password"
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           />
           <Button type="submit" onClick={signIn}>Sign In</Button>
           </form>
         
       
        </div>
        
      </Modal>


      <div className='app__header'>
      <img
          className='app__headerImage' 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="">

        </img>
        {user ? (

          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
         </div>


        )}
      </div>

      <div className="app__posts"> 
        <div className="app__postsLeft">
        {
        posts.map(({id, post })=> (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}> </Post>
        ))
      }



     
      

      

        </div>
        <div className="app__postsRight">
          <div style={{ display: 'flex' }}>
            <InstagramEmbed url="https://www.instagram.com/kanguvathemovie/p/DCep7LOSi7q/" width={328} captioned />
            <Suggestions></Suggestions>
          </div>
          
        </div>
      
      
         </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />

      ): (
        <h3 className="app__upload">Sorry you need to login to upload</h3>
      )}
      
      
      
      
      
    </div>
  );
}

export default App;
