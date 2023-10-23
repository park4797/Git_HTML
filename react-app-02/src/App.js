import { useState } from "react";

function Article(props){
  return <article>
    <h2>{props.title}</h2>
    <p>{props.body}</p>
  </article>
}

function Header(props) {
  return <header>
    <h2><a href="/" onClick={(event) => {
      event.preventDefault();
      props.onChangeMode();
    }} >{props.title}</a></h2>
  </header>
}

function Nav(props){
  const lis = []// 화면에 출력할 값을 배열에 저장하여 풀어준다.
  
  for(let i=0; i < props.topics.length; i++){
    let t = props.topics[i]; // props.topics를 받는 변수 선언
    lis.push(<li key={t.id}>
      <a id={t.id} href={"/read/" + t.id} onClick = {(event) => {
      event.preventDefault();
      props.onChangeMode(Number(event.target.id)); // 불러오는 id값이 문자열이므로 숫자로 컨버팅
      // a 태그에 id값을 주고 event.target.id로 불러온다.
    }}>{t.title}</a>
    </li>)
  }

  return <nav>
    <ul>
      {lis}
    </ul>
  </nav>
}

function App() {
  // const _mode = useState("WELCOME") // mode값을 주어 변경하겠다.
  // const mode = _mode[0]; // _mode를 통해 상태를 읽을 수 있다.
  // const setMode = _mode[1]; // 1번째 원소인 setMode를 통해 모드의 값을 바꿀 수 있다.
  // comsole.log("_mode", _mode);
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState("null");

  const topics = [
    {id:1, title : "html", body : "html is ..."},
    {id:2, title : "css", body : "css is ..."},
    {id:3, title : "javascript", body : "javascript is ..."},
  ]

  let content = null; // 내용을 담을 빈 변수 선언
  if(mode === "WELCOME"){ // 모드마다 작동할 것들을 지정(모드 제작)
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  }else if(mode === "READ"){
    let title, body = null; // title과 body값 초기화
    for(let i = 0; i < topics.length; i++){
      console.log(topics[i].id, id)
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode = {() => {
        setMode("WELCOME");
      }}></Header>
      <Nav topics={topics} onChangeMode ={(_id) => {
        setMode("READ");
        // setMode로 인해 mode가 READ로 바뀌면 App compornent가 재실행되어
        // useState가 mode값을 READ로 세팅해준다.
        setId(_id)
      }}></Nav>
      {content}
    </div>
  );
}

export default App;
