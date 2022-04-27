import React from 'react';
import { ActionCableConsumer } from 'react-actioncable-provider';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: []
    }
  }

  // componentDidMount() {
  //   this.fetch
  //   this.createSubscription()
  // };

  // fetchMessages = () => {
  //   fetch('http://localhost:3000/messages')
  //     .then(res => res.json())
  //     .then(messages => this.setState({ messages: messages }))
  // }

  // createSubscription = () => {
  //   this.cable.subscriptions.create(
  //     { channel: 'DeviceStatisticChannel' },
  //     { received: message => this.handleReceivedMessage(message) }
  //   )
  // }

  mapMessages = () => {
    return this.state.messages.map((message, i) => 
      <li key={i}>{message.content}</li>)
  }

  handleReceivedMessages = message => {
    console.log('message')
    console.log(message)
    console.log('message')
    this.setState({ messages: [...this.state.messages, message] })
  }

  // handleMessageSubmit = e => {
  //   e.preventDefault();
  //   const messageObj = {
  //     message: {
  //       content: e.target.message.value
  //     }
  //   }
  //   const fetchObj = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(messageObj)
  //   }
  //   fetch('http://localhost:3000/messages', fetchObj)
  //   e.target.reset()
  // }

  render() {
    return (
      <div className='App'>
        <ActionCableConsumer
          channel={{ channel: 'DeviceStatisticChannel' }}
          onReceived={this.handleReceivedMessages}
        />
      </div>
    );
  }
}
export default App;
