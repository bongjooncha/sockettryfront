import {useState, useEffect} from "react";
import "./App.css";
import InputField from "./components/InputField/InputField";
import MessageContainer from "./components/MessageContainer/MessageContainer";

//socket 서버와 연결
import socket from "./server";

function App() {
  //user 정보 저장
  const [user,setUser] = useState(null);
  useEffect(()=>{
    socket.on("message",(message)=>{
      setMessageList((prevState)=> prevState.concat(message));
    })
    askUserName();
  },[]);
  const askUserName = ()=>{
    //위에 팝업창에서 물어보는것
    const userName = prompt("이름 입력해 봐라");
    console.log("니이름",userName);

    //소켓에 username 보냄+작처리가 됐는지 res보냄
    socket.emit("login",userName,(res)=>{
      if(res?.ok){
        setUser(res.data);
      }
    });
  };
  //message 보냄 및 저장
  const [message,setMessage]=useState('');
  const sendMessage = (event) =>{
    //웹페이지 refresh하는것을 막음
    event.preventDefault();
    socket.emit("sendMessage",message,(res)=>{
      console.log("sendMessage res", res);
    })
  };
  //message list 보냄
  const [messageList, setMessageList] = useState([]);
  console.log("message List", messageList);

  return (
    <div>
      <div className="App">
        <MessageContainer messageList={messageList} user={user}/>
        <InputField message={message} setMessage={setMessage} sendMessage={sendMessage}/>
      </div>
    </div>
  );
}

export default App;
