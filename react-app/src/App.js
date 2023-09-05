import "./App.css";
import { useState } from "react";

// props 는 component를 사용하는 외부자를 위한 데이터
// state는 component를 만드는 내부자를 위한 데이터
// react의 본질은 사용자정의 태그(component)를 만드는 것

// 사용자정의 태그(component)를 만들때는 반드시 대문자로 시작한다.
function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Header(props) {
  // console.log('props', props.title);
  return <header>
    {/* 사용자가 header를 클릭했을때 해야할 작업 정의 */}
    {/* 파라미터가 하나인경우 괄호를 생략해도 된다 */}
    <h1><a href='/' onClick={event => {
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
    {/* 중괄호내 문자는 표현식으로 취급 */}
  </header>
}

function Nav(props) {
  const lis = []
  for(let i = 0; i < props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id = {t.id} href={'/read/'+t.id} onClick={event => {
      event.preventDefault();
      props.onChangeMode(Number(event.target.id));
      // 입력한 id값을 태그의 속성으로 넘기면 문자열이 된다.
      // 따라서 숫자로 컨버팅해주어야 한다.

      // props.onChangeMode(t.id); 사용시도 가져왔다.
      }}>{t.title}</a>
    </li>)
    // 자동으로 생성한 태그의 경우
    // 리액트의 추적의 근거로 고유의 키값을 제공해야 한다.
  }

  return <nav>
    <ol>
      {lis}
      {/* 배열의 내용을 풀어서 배치시킨다 */}
    </ol>
  </nav>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder="body"/></p>
      <p><input type="submit" value="Create"/></p>
    </form>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  // props.title로 들어오는 title을 state로 환승
  return <article>
    <h2>Update</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={(event => {
        setTitle(event.target.value);
      })}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={(event) => {
        setBody(event.target.value);
      }}/></p>
      <p><input type="submit" value="Update"/></p>
    </form>
  </article>
}

function App() {
  /*
  const _mode = useState('WELCOME');
  const mode = _mode[0]; // 상태의 값을 읽는다
  const setMode = _mode[1]; // setMode를 통해 mode값을 변경할 수 있다.
  // mode 값을 주어 제어
  */

  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState('null');
  const [nextId, setNextId] = useState(4); // 현재 3개의 id 값이 존재하므로
  // id 값을 별도로 관리

  /*
  console.log('_mode', _mode);
    0번 값은 상태의 값을 읽을때 쓰는 데이터
    1번 값은 상태의 값을 변경할 때 사용하는 함수
  */

  // Nav의 정보가 여러개이기 때문에 배열로 처리
  const [topics, setTopics] = useState([
    {id : 1, title : "html", body : "html is ..."},
    {id : 2, title : "css", body : "css is ..."},
    {id : 3, title : "javascript", body : "javascript is ..."}
  ]);

  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if(mode === 'READ') {
    let title, body = null;
    for(let i = 0; i < topics.length; i++){
      // console.log(topics[i].id, id)
      if(topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a href={"/update"+id} onClick={event => {
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={() => {
        const newTopics = [];
        for(let i = 0; i < topics.length; i++) {
          if(topics[i].id !== id) {
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }}/> </li>
    </>
  } else if(mode === 'CREATE') {
    content = <Create onCreate={(_title, _body) => {
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics] // topics가 배열이기 때문에 배열로 복제
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId + 1);
    }}></Create>
  } else if(mode === 'UPDATE') {
    let title, body = null;
    for(let i = 0; i < topics.length; i++){
      if(topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate = {(title, body) => {
      console.log(title, body);
      const newTopics = [...topics];
      const updatedTopic = {id:id, title:title, body:body};
      for(let i = 0; i < newTopics.length; i++) {
        if(newTopics[i].id === id) {
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics); // 새로운 topics 저장
      setMode('READ')
    }}></Update>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={() => {
        setMode("WELCOME");
      }}></Header>
      <Nav topics={topics} onChangeMode= {id => {
        setMode("READ");
        setId(id);
        // App 함수는 다시 시작되기 때문에 return 값에 변화가 없다.
      }}></Nav>
      {/* ""로하면 문자열로 전달되기 때문에 표현식으로 적는다{} */}
      {/* Nav내 정보를 Javascript의 structure에 맞게 바꿔야 한다 */}
      {content}
      <ul>
        <li><a href="/create" onClick={event => {
          event.preventDefault();
          setMode("CREATE");
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
