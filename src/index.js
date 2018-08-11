import React from 'react'
import ReactDOM from 'react-dom'
import Contract from './contract'

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
      tx: null,
      tries: 0
    }
  }

  async componentWillMount() {
    await this.contract.loadContract()
    this.contract.addEventListener((v) => {
      this.setState({ value: v._value })
    })
  }

  onChangeHandler(event) {
    this.value = event.target.value
    const isValid = this.value > 0
    this.setState({ isValid })
  }

  async confirmValue() {
    this.setState({isSending: true})
    try {
      //  ここでmessage送る
      const tx = await this.contract.setValue(this.value)
      this.textInput.current.value = ''
      this.setState({ tx, isValid: false })
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
          <div style={{flex: 1}}>
            <p>Sending</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container" style={{ marginTop: 10, width: '60%', marginHorizontal: 'auto', position: 'relative' }}>

        <header id="header">
          <h1>Loom Stamp Chat</h1>
        </header>

        <div className="input-area" style={{
        }}>

          <ul style={{padding: 0, margin: 0}}>
            <li style={{listStyle: 'none'}}><a href="#">
              <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                <div style={{width: 50, height: 50, overflow: 'hidden'}}>
                  <img src="https://qiita-image-store.s3.amazonaws.com/0/73130/profile-images/1473699397" alt="" style={{borderRaidus: 50, width: '100%', height: '100%'}}/>
                </div>
                <div className="message" style={{  }}>
                  <p>fefe</p>
                </div>
              </div>
            </a></li>
            <li style={{listStyle: 'none'}}><a href="#">
              <div style={{ display: 'flex', alignItems: 'flex-start', alignSelf: 'flex-start' }}>
                <div style={{width: 50, height: 50, overflow: 'hidden'}}>
                  <img src="https://qiita-image-store.s3.amazonaws.com/0/73130/profile-images/1473699397" alt="" style={{borderRaidus: 50, width: '100%', height: '100%'}}/>
                </div>
                <div className="message" style={{ alignSelf: 'center' }}>
                  <p>fefe</p>
                </div>
              </div>
            </a></li>
          </ul>

        </div>

        <div className="input-area">
          <form onSubmit={e => { e.preventDefault(); }}>
            <div className="form-group" style={{display: 'inline-block'}}>
              <div className="input" style={{display: 'inline-block', width: '65%'}}>
                <input type="text" className="form-control" onChange={(event) => this.onChangeHandler(event)} ref={this.textInput}/>
              </div>
              <button style={{display: 'inline-block', marginLeft: 10}} type="button" disabled={!this.state.isValid || this.state.isSending} className="btn btn-primary" onClick={() => this.confirmValue()}>Confirm</button>
            </div>
          </form>
        </div>

      </div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'))

