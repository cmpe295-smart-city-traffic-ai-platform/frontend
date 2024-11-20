package com.cmpe295B.alert_service;

import com.cmpe295B.model.Device;
import com.cmpe295B.model.TrafficData;
import com.cmpe295B.model.Alert;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AlertController {

    @Autowired
    private RestTemplate restTemplate;

    private List<Alert> alerts = new ArrayList<>();

    @GetMapping("/generateAlerts")
    public ResponseEntity<String> generateAlerts() {
        try {
            // Simulated device data
            Device[] devices = new Device[] {
                new Device("fc1bde95-ca92-47ab-9358-d98abc004394", "Device 1")
            };

            for (Device device : devices) {
                String trafficDataUrl = "http://aba100847c9be49a08d8cd8213be1f9a-1863731257.us-east-1.elb.amazonaws.com/api/v1/iot/traffic/history/" + device.getId();
                ResponseEntity<TrafficData[]> trafficResponse = restTemplate.getForEntity(trafficDataUrl, TrafficData[].class);
                TrafficData[] trafficDataArray = trafficResponse.getBody();

                // Debugging: Print the fetched traffic data
                System.out.println("Traffic Data Array: " + Arrays.toString(trafficDataArray));

                if (trafficDataArray != null) {
                    for (TrafficData trafficData : trafficDataArray) {
                        // Check for traffic jams
                        if (trafficData.getCurrentSpeed() < 25) {  
                            Alert alert = new Alert(
                                "Traffic Jam",
                                "Low speed detected on device " + device.getName(),
                                LocalDateTime.now(),
                                "High",
                                device.getId(),
                                trafficData.getLocation()
                            );
                            alerts.add(alert);
                        }

                        // Check for road closures
                        if (trafficData.getFlowSegmentData() != null && trafficData.getFlowSegmentData().isRoadClosure()) {  
                            Alert alert = new Alert(
                                "Road Closure",
                                "Road near device " + device.getName() + " is closed.",
                                LocalDateTime.now(),
                                "Critical",
                                device.getId(),
                                trafficData.getLocation()
                            );
                            alerts.add(alert);
                        }

                        // Check for congestion based on speed difference
                        if (trafficData.getFlowSegmentData() != null) {
                            double freeFlowSpeed = trafficData.getFlowSegmentData().getFreeFlowSpeed();
                            double currentSpeed = trafficData.getCurrentSpeed();
                            double speedDiff = freeFlowSpeed - currentSpeed;

                            if (speedDiff >= 10) {
                                Alert alert = new Alert(
                                    "Congestion Alert",
                                    "Device " + device.getName() + " reports congestion.",
                                    LocalDateTime.now(),
                                    "Moderate",
                                    device.getId(),
                                    trafficData.getLocation()
                                );
                                alerts.add(alert);
                            }
                        }
                    }
                }
            }
            return ResponseEntity.ok("Alerts generated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error generating alerts: " + e.getMessage());
        }
    }

    @GetMapping("/alerts")
    public List<Alert> getAlerts() {
        return alerts;
    }
}
