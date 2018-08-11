import {
  Client, LocalAddress, CryptoUtils, LoomProvider
} from 'loom-js'

import Web3 from 'web3'
import ChatRoom from './contracts/ChatRoom.json'

export default class Contract {
  async loadContract() {
    this.onEvent = null
    this._createClient()
    this._createCurrentUserAddress()
    this._createWebInstance()
    await this._createContractInstance()
  }

  _createClient() {
    this.privateKey = CryptoUtils.generatePrivateKey()
    this.publicKey = CryptoUtils.publicKeyFromPrivateKey(this.privateKey)
    this.client = new Client(
      'default',
      'ws://127.0.0.1:46657/websocket',
      'ws://127.0.0.1:9999/queryws',
    )

    this.client.on('error', msg => {
      console.error('Error on connect to client', msg)
      console.warn('Please verify if loom command is running')
    })
  }

  _createCurrentUserAddress() {
    this.currentUserAddress = LocalAddress.fromPublicKey(this.publicKey).toString()
  }

  _createWebInstance() {
    this.web3 = new Web3(new LoomProvider(this.client, this.privateKey))
  }

  async _createContractInstance() {
    const networkId = await this._getCurrentNetwork()
    this.currentNetwork = ChatRoom.networks[networkId]
    console.log(networkId)
    console.log(ChatRoom)
    console.log(ChatRoom.networks)
    if (!this.currentNetwork) {
      throw Error('Contract not deployed on DAppChain')
    }

    const ABI = ChatRoom.abi
    this.chatRoomInstance = new this.web3.eth.Contract(ABI, this.currentNetwork.address, {
      from: this.currentUserAddress
    })
    console.log('poyo', this.chatRoomInstance.events)

    this.chatRoomInstance.events.SendText({}, (err, event) => {
      console.log('SendText')
      if (err) console.error('Error on event', err)
      else {
        if (this.onEvent) {
          this.onEvent(event.returnValues)
        }
      }
    })

  }

  addEventListener(fn) {
    console.log('addEventListener')
    this.onEvent = fn
  }

  async _getCurrentNetwork() {
    return await this.web3.eth.net.getId()
  }

  async sendText(text) {
    return await this.chatRoomInstance.methods.sendText(text).send({
      from: this.currentUserAddress
    })
  }

  async getMessagesCount() {
    return await this.chatRoomInstance.methods.getMessagesCount().send({
      from: this.currentUserAddress
    })
  }

  async getMessage(user, index) {
    return await this.chatRoomInstance.methods.getMessage(user, index).send({
      from: this.currentUserAddress
    })
  }

  async getUsers(user, index) {
    return await this.chatRoomInstance.methods.getUsers().send({
      from: this.currentUserAddress
    })
  }
}
