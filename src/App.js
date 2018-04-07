import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Input, List, Pagination, Avatar} from 'antd';
//import 'antd/dist/antd.css';

const Search = Input.Search;

let MockData = {};
/**
 * 模拟数据模型：
 * {
 *    page1: [
 *      'xxx',
 *      'yyy',
 *      ...
 *    ],
 *    page2: [
 *      'xxx',
 *      'yyy',
 *      ...
 *    ],
 *    ...
 * }
 */
for(let i=1;i<51;i++) {
  let pageData = []
  for(let j=1;j<11;j++){
    //50页，每页10数据
    pageData.push(`第${i}页, 第${j}条数据: ${Math.random()}`)
  }

  MockData = { ...MockData, ['page' + i]: pageData}
}
// console.log(MockData);


const start = 0;
const count = 5;
class App extends Component {

  constructor() {
    super()
    this.state = {
      pageNumber: 1,

      //doubanPageNumber: 0,
      total: 0,
      
      searchName: '',
      movie: [],
    }
  }
  onChangeHandle = (pageNumber)=>{
    this.setState({
      pageNumber: pageNumber
    })
    //console.log(`page in ${pageNumber}`)
  }

  getMockData = (pageNumber) => {
    
    return MockData['page' + pageNumber]
  }

  getApiData = (searchName, start, count) => {
    axios.get(`/v2/movie/search?q=${searchName}&start=${start}&count=${count}`).then(res => {
      if (res.status === 200) {
        console.log(res.data)
        //收到后显示//懒得加网络等待了
        let movieTemp = []
        res.data.subjects.map((value) => movieTemp.push(value.images.large))

        this.setState({
          movie: movieTemp,
          total: res.data.total,
        })
      }
    })
  }

  onSearchClick = (search) => {
    this.setState({
      searchName: search
    })
    this.getApiData(search, start, count);
    
    //console.log(search)
  }
  onDoubanChangeHandle = (pageNumber)=> {
    this.getApiData(this.state.searchName, (pageNumber - 1) * count, count);

    //console.log(`page in ${pageNumber}`)
  }

  render() {

    const moviePagination = (
      <div>
        <List
          header={<div style={{ fontSize: 20, color: '#f00', fontWeight: 700 }}>豆瓣电影api搜索数据展示</div>}
          bordered
          dataSource={this.state.movie}
          renderItem={item => (
            <List.Item
            
              extra={<img width={272} alt="logo" src={item} />}
            >
              {/* <List.Item.Meta
                avatar={<Avatar src={item} />}
                
              /> */}
            </List.Item>
            
            )}
        />

        <Pagination
          showQuickJumper
          defaultCurrent={1}
          defaultPageSize={count}
          total={Math.ceil(this.state.total)}
          onChange={this.onDoubanChangeHandle}
        />
      </div>
    )

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <Search
          placeholder="豆瓣电影搜索"
          onSearch={value => this.onSearchClick(value)}
          enterButton
        />
        {this.state.movie && this.state.total!==0 ? moviePagination:null}
        

        <br/>
        <br />
        <br />

        <List
          header={<div style={{fontSize: 20, color: '#f00', fontWeight: 700}}>Mock数据展示</div>}
          bordered
          dataSource={this.getMockData(this.state.pageNumber)}
          renderItem={item => (<List.Item>{item}</List.Item>)}
        />

        <Pagination
          showQuickJumper
          defaultCurrent={1}
          total={500}
          onChange={this.onChangeHandle}
        />
          
      </div>
    );
  }
}

export default App;
