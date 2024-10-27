import React, { Component } from 'react';
import alertsData from '../../data/alertData';

class Alerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: [],
    };
  }

  componentDidMount() {
    console.log('Loading alerts data:', alertsData);
    // simulate data
    this.setState({ alerts: alertsData });
  }

  render() {
    return (
      <div>
        <h1>Alerts Page</h1>
        <div className="alerts-list">
          {this.state.alerts.length > 0 ? (
            this.state.alerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.severity.toLowerCase()}`}>
                <h3>{alert.type} Alert</h3>
                <p>{alert.message}</p>
                <span>{alert.timestamp}</span>
              </div>
            ))
          ) : (
            <p>No alerts available</p>
          )}
        </div>
      </div>
    );
  }
  
}

export default Alerts;
