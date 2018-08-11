import React from 'react'
import ReactDOM from 'react-dom'
import Contract from './contract'
import createKeccakHash from 'keccak'

const Index = class Index extends React.Component {
  constructor(props) {
    super(props)

    this.textInput = React.createRef();

    this.contract = new Contract()
    this.value = 0

    this.state = {
      value: 0,
      isValid: false,
      isSending: false,
      tries: 0,
      messages: [
        {timestamp: 0, stamp: 1}
      ],
      isStamp: false
    }
  }

  async componentWillMount() {
    await this.contract.loadContract()
    this.contract.addEventListener((v) => {
      this.setState({
        messages: [...this.state.messages, {
          text: v.text,
          timestamp: v.timestamp
        }]
      })
    })
    this.contract.addOnMintColorStampToken((v) => {
      this.setState({
        messages: [...this.state.messages, {
          stamp: v.stamp,
          timestamp: v.timestamp
        }]
      })
    })
  }

  onChangeHandler(event) {
    this.value = event.target.value
    const isValid = this.value.length < 140
    this.setState({ isValid })
  }

  compare(a, b) {
    const genreA = a.timestamp;
    const genreB = b.timestamp;

    let comparison = 0;
    if (genreA > genreB) {
      comparison = 1;
    } else if (genreA < genreB) {
      comparison = -1;
    }
    return comparison;
  }

  getDNA(x) {
    return createKeccakHash('keccak256').update(String(x)).digest('hex').substring(0, 6)
  }

  async SendText() {
    this.setState({isSending: true})
    try {
      const tx = await this.contract.sendText(this.value)
      this.textInput.current.value = ''
      this.setState({
        isValid: false
      })
    } catch (err) {
      console.error('Ops, some error happen:', err)
    }
    this.setState({isSending: false})
  }


  async SendStamp(stamp) {
    this.setState({isSending: true})
    try {
      const tx = await this.contract.mintColorStampToken()
      this.setState({
        isValid: false
      })
    } catch (err) {
      console.error('Ops, some error happen:', err)
    }
    this.setState({isSending: false})
  }

  render() {
    const loomyAlert = (
      <div className="alert alert-warning">
        I dare you to type 47 and press Confirm !
      </div>
    )

    if (this.state.isSending) {
      return(
        <div style={{position: 'fixed', width: '100%', height: '100%', background: 'rgba(51,51,51,0.5)' }}>
          <div style={{flex: 1, alignSelf: 'center', alignItems: 'center'}}>
            <p>Sending...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container" style={{ marginTop: 10, width: '60%', marginHorizontal: 'auto', position: 'relative' }}>

        <header id="header">
          <h1>Loom Stamp Chat</h1>
        </header>

        <div className="contaier">
          <div className="message-area">
            <h2>タイムライン</h2>
            <ul style={{padding: 0, margin: 0}}>
              {this.state.messages.sort(this.compare).map((message) => {
                return(
                  <li style={{listStyle: 'none', padding: '8px'}}><a href="#">
                    <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                      <div style={{width: 50, height: 50, overflow: 'hidden', marginRight: "24px"}}>
                        <img src="https://qiita-image-store.s3.amazonaws.com/0/73130/profile-images/1473699397" alt="" style={{borderRaidus: 50, width: '100%', height: '100%'}}/>
                      </div>
                      {
                        message.text ? 
                        (
                          <div className="message">
                            <p>{ message.text }</p>
                          </div>
                        ) :
                        (
                          <div style={{width: 50, height: 50, backgroundColor: `#${this.getDNA(message.stamp)}`}}/>
                        )
                      }
                    </div>
                  </a></li>
                );
              })}
            </ul>
          </div>
        </div>
{/*
        {
          this.state.isStamp
            ? (<div className="stamp-area" style={{top: '25%', left: '25%', width: 100, height: 100, padding: 20, backgroudColor: 'rgba(51,51,51,0.5', zIndex: 99}}>
                <ul style={{padding: 0, margin: 0}}>
                  {this.state.messages.sort(-1).map((message) => {
                    if (message.stamp) {
                      return(
                        <li style={{listStyle: 'none'}} onClick={this.SendStamp(message.stamp)}>
                          <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                            <div style={{width: 50, height: 50, overflow: 'hidden', background: message.stamp}}>
                            </div>
                            <p>{ message.stamp }</p>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>)
            : null
        }*/}

        <div className="input-area">
          <p>スタンプ</p>
          <form onSubmit={e => { e.preventDefault(); }}>
            <div className="form-group" style={{display: 'inline-block'}}>
              <div className="input" style={{display: 'inline-block', width: '65%'}}>
                <input type="text" className="form-control" onChange={(event) => this.onChangeHandler(event)} ref={this.textInput}/>
              </div>
              <button style={{display: 'inline-block', marginLeft: 10}} type="button" disabled={!this.state.isValid || this.state.isSending} className="btn btn-primary" onClick={() => this.SendText()}>Confirm</button>
            </div>
          </form>
        </div>


      </div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'))

