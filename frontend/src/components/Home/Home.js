import React, {Component} from "react";
import NavigationBar from "../Navbar/Navbar";
import axios from "axios";

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            droneDevices: [],
            iotDevices: [],
            cctvDevices:[],
            users: [],
        };
        
        }
        componentDidMount(){
        axios.get("http://localhost:8080/api/dashboard/users")
            .then((res)=> {
                console.log(res.data);
                this.setState({users: res.data});
                }).catch(error => {
                console.error('Error getting users', error);
               });
        
        //console.log("users", users)
        }
render() {

    const {users} = this.state;
     return(
        <div>
            <h1>Home Page</h1>
            {users.length === 0 ? (
                <p>No Items</p>
            ):(
            <ul>
                {users.map((user, index)=> (
                    <li key={index}>
                        <p>{user.firstName}</p>
                        <p>{user.lastName}</p>
                        <p>{user.email}</p>
                        <p>{user.userId}</p>
                        <p>{user.role}</p>
                    </li>
                ))}
            </ul>
            
            )}
            
        </div>
    );
}
}

export default Home;