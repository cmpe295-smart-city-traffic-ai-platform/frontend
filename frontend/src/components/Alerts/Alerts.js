import React, {Component} from "react";
class Alerts extends Component {
render() {
    const user_id = localStorage.getItem("user_id");
    if(user_id == null)
        window.location = "/login"; 
    return(
        <div><h1>Alerts Page</h1></div>
    );
}
}

export default Alerts;