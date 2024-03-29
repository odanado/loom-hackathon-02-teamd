import React from 'react'
import ReactDOM from 'react-dom'
import Contract from './contract'
import createKeccakHash from 'keccak'

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

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
      stamps: [],
      isStamp: false
    }
  }

  async componentWillMount() {
    await this.contract.loadContract()
    
    this.contract.addEventListener((v) => {
      this.setState({
        messages: [...this.state.messages, {
          text: v.text === "" ? null : v.text,
          stamp: v.stampToken === "0" ? null : v.stampToken,
          timestamp: v.timestamp
        }]
      })
    })

    this.contract.addOnMintColorStampToken((v) => {
      this.setState({
        stamps: [...this.state.stamps, {
          id: v.tokenId
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
    await sleep(100)
    this.setState({isSending: false})
  }


  async SendStamp(stamp) {
    this.setState({isSending: true})
    try {
      const tx = await this.contract.sendStamp(stamp)
    } catch (err) {
      console.error('Ops, some error happen:', err)
    }
    await sleep(100)
    this.setState({isSending: false})
  }

  async MintColorStampToken() {
    this.setState({isSending: true})
    try {
      const tx = await this.contract.mintColorStampToken()
    } catch (err) {
      console.error('Ops, some error happen:', err)
    }
    await sleep(100)
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

        <div className="contaier" style={{ display: 'inline-block', width: '45%' }}>
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

        <div className="stamp-area" style={{ display: 'inline-block', width: '45%', verticalAlign: 'top' }}>
          <h2>スタンプ</h2>
          <ul style={{padding: 0, margin: 0}}>
            {this.state.stamps.map((stamp) => {
              return(
                <li style={{listStyle: 'none'}} onClick={() => this.SendStamp(stamp.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                    <div style={{width: 50, height: 50, overflow: 'hidden', marginTop: 16, backgroundColor: this.getDNA(stamp.id)}}>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="input-area">
          <form onSubmit={e => { e.preventDefault(); }}>
            <div className="form-group" style={{display: 'inline-block'}}>
              <div className="input" style={{display: 'inline-block', width: '65%'}}>
                <input type="text" className="form-control" onChange={(event) => this.onChangeHandler(event)} ref={this.textInput}/>
              </div>
              <button style={{display: 'inline-block', marginLeft: 10}} type="button" disabled={!this.state.isValid || this.state.isSending} className="btn btn-primary" onClick={() => this.SendText()}>Confirm</button>
            </div>
          </form>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => this.MintColorStampToken()}
        >
          スタンプ生成
        </button>


      </div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'))

