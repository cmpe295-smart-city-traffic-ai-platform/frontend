import { React, Component } from "react";
import {Routes, Route} from "react-router-dom";
import NavigationBar from "./Navbar/Navbar";
import Home from "./Home/Home";
import Alerts from "./Alerts/Alerts";
import Settings from "./Settings/Settings";
import Registration from "./Registration/Registration";
import IOT from "./IOT/IOT";
class Main extends Component {
    render(){
        return (
            <div>
                <Route path="/" component={NavigationBar} />
                <Route path="/home" component={Home} />
                <Route path="/alerts" component={Alerts} />
                <Route path="/settings" component={Settings}/>
                <Route path="/registration" component={Registration}/>
                <Route path="/iot" component={IOT}/>
            </div>
        )
    }
}

export default Main;