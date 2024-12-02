import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');  // Connect to the Flask server

const Livefeed = (props) => { 
    const [totalCarCount, setTotalCarCount] = useState(0);
    const [frame, setFrame] = useState('');

    useEffect(() => {
        const startCounting = async () => {
            if(props.cctvLiveFeedUrl !== ""){
                try {
                    await axios.post('http://localhost:5000/count-cars', { url: props.cctvLiveFeedUrl });
                } catch (error) {
                    console.error("There was an error starting the car counting:", error);
                }
            }

        };

        startCounting();

        socket.on('frame', (data) => {
            setFrame(`data:image/jpeg;base64,${data.frame}`);
        });

        socket.on('car_count', (data) => {
            setTotalCarCount(prevCount => prevCount + data.car_count);
        });

        return () => {
            socket.off('frame');
            socket.off('car_count');
        };
    }, [props.cctvLiveFeedUrl]);

    return (
        <div className="App">
            <h4>CCTV Live Feed</h4>
            {props.cctvLiveFeedUrl === "" ? 
                <div><p>No Live Footage Available</p></div> 
                :
                <div>
                    <p>Cars counted: <b>{totalCarCount}</b> </p>
                    {/* <iframe src={props.cctvLiveFeedUrl} title="Live Video" width="800" height="800" frameBorder="0" allowFullScreen></iframe> */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {frame && <img src={frame} alt="Processed Frame" style={{ width: '80vw', height: 'auto', maxWidth: '100%' }} /> }
                    </div>
                </div>
            }
        </div>
    );
} 

export default Livefeed;
