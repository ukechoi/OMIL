import React from 'react';
import logo from './logo.svg';
import './App.css';

import memuCal from './assets/img/calendar.svg';

class App extends React.Component {

  componentDidMount() {
    
  }

  newElement = () => {

  }

	render() {
		return (
    <>
      <div className="root">
        <div className="content">

          <div className="header">
            <div className="hr1">확신의 말</div>
            <div className="hr2">2년 뒤 나는 구글 본사에서 <br/>디자이너로 일하고 있을 것이다....😁</div>
          </div>

          <div className="body">
            <div className="bd1">Today<span>10.23.FRI</span></div>

            <div className="bodyBox" style={{backgroundColor:'#C4BDAF'}}>
              <div className="bodyBox-time">9am</div>
              <div className="bodyBox-title">Omil 유저리스트 작성</div>
              <div className="bodyBox-category">flinto project</div>
            </div>
            <div className="bodyBox" style={{backgroundColor:'#B2ACFA'}}>
              <div className="bodyBox-time">12pm</div>
              <div className="bodyBox-title">예약 마크업 맡기기</div>
              <div className="bodyBox-category">flinto project</div>
            </div>
            <div className="bodyBox" style={{backgroundColor:'#FBE192'}}>
              <div className="bodyBox-time">3pm</div>
              <div className="bodyBox-title">안과 검진</div>
              <div className="bodyBox-category">flinto project</div>
            </div>       
            <div className="bodyBox" style={{backgroundColor:'#C4BDAF'}}>
              <div className="bodyBox-time">9am</div>
              <div className="bodyBox-title">Omil 유저리스트 작성</div>
              <div className="bodyBox-category">flinto project</div>
            </div>
            <div className="bodyBox" style={{backgroundColor:'#B2ACFA'}}>
              <div className="bodyBox-time">12pm</div>
              <div className="bodyBox-title">예약 마크업 맡기기</div>
              <div className="bodyBox-category">flinto project</div>
            </div>
            <div className="bodyBox" style={{backgroundColor:'#FBE192'}}>
              <div className="bodyBox-time">3pm</div>
              <div className="bodyBox-title">안과 검진</div>
              <div className="bodyBox-category">flinto project</div>
            </div>
            <div className="bodyBox" style={{backgroundColor:'#C4BDAF'}}>
              <div className="bodyBox-time">9am</div>
              <div className="bodyBox-title">Omil 유저리스트 작성</div>
              <div className="bodyBox-category">flinto project</div>
            </div>
            <div className="bodyBox" style={{backgroundColor:'#B2ACFA'}}>
              <div className="bodyBox-time">12pm</div>
              <div className="bodyBox-title">예약 마크업 맡기기</div>
              <div className="bodyBox-category">flinto project</div>
            </div>
            <div className="bodyBox" style={{backgroundColor:'#FBE192'}}>
              <div className="bodyBox-time">3pm</div>
              <div className="bodyBox-title">안과 검진</div>
              <div className="bodyBox-category">flinto project</div>
            </div>

          </div>
      
        </div>

        <div className="vfooter">
          <div className="vfooter-zone horizontal">
            <div className="menubtn">
              <img src={require("./assets/img/calendar.svg")} />
            </div>
            <div className="menubtn">
              <img src={require("./assets/img/home.svg")} />
            </div>
            <div className="menubtn">
              <img src={require("./assets/img/more.svg")} />
            </div>
          </div>

          
        </div>



      </div>
    </>
		);
	}
}

export default App;
