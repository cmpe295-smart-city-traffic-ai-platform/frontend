import { React, Component } from "react";
import {Routes, Route} from "react-router-dom";
import NavigationBar from "./Navbar/Navbar";
import Home from "./Home/Home";
import Alerts from "./Alerts/Alerts";
import Settings from "./Settings/Settings";
import Registration from "./Registration/Registration";
class Main extends Component {
    render(){
        return (
            <div>
                <Route path="/" component={NavigationBar} />
                <Route path="/home" component={Home} />
                <Route path="/alerts" component={Alerts} />
                <Route path="/settings" component={Settings}/>
                <Route path="/registration" component={Registration}/>
            </div>
        )
    }
}

export default Main;