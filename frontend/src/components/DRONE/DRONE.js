import React, { useEffect } from "react";

const DRONE = () => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const lastN = localStorage.getItem("lastName");
    const firstN = localStorage.getItem("firstName");
    const user_id = localStorage.getItem("user_id");
    const password = localStorage.getItem("password");

    useEffect(() => {
        if (user_id == null) {
            window.location = "/login";
        }
    }, [user_id]);

    const handleIframeLoad = () => {
        const iframe = document.getElementById("drone_app");
        iframe.contentWindow.postMessage(
            { email, role, lastN, firstN, user_id, password },
            "https://100.26.248.255:5001"
        );
    };

    return (
        <iframe
            src="https://100.26.248.255:5001/"
            style={{ width: "90%", height: "100%", border: "none" }}
            title="Secondary Project"
            id="drone_app"
            onLoad={handleIframeLoad}
        ></iframe>
    );
};

export default DRONE;
