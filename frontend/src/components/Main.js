import { React, Component } from "react";
import {Routes, Route} from "react-router-dom";
import NavigationBar from "./Navbar/Navbar";
import Home from "./Home/Home";
import Alerts from "./Alerts/Alerts";
import Settings from "./Settings/Settings";
import Registration from "./Registration/Registration";
import IOT from "./IOT/IOT";
import IOTTrafficHistory from "./IOT/IOTTrafficComponents/IOTTrafficHistory";
import IOTTrafficPrediction from "./IOT/IOTTrafficComponents/IOTTrafficPrediction";
import TrafficMap from "./Home/Traffic/TrafficMap";

class Main extends Component {
    render(){
        return (
            <div>
                <Route path="/" component={NavigationBar} />
                <Route path="/home" component={Home} />
                <Route path="/alerts" component={Alerts} />
                <Route path="/settings" component={Settings}/>
                <Route path="/registration" component={Registration}/>
                <Route exact path="/iot" component={IOT}/>
                <Route exact path="/iot/traffichistory" component={IOTTrafficHistory}/>
                <Route exact path="/iot/trafficprediction" component={IOTTrafficPrediction}/>
                <Route exact path="/trafficmap" component={TrafficMap}/>
            </div>
        )
    }
}

export default Main;