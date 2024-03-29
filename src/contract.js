import {
  Client, LocalAddress, CryptoUtils, LoomProvider
} from 'loom-js'

import Web3 from 'web3'
import ChatRoom from './contracts/ChatRoom.json'

export default class Contract {
  async loadContract() {
    this.onEvent = null
    this.onMintColorStampToken = null
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

    if (!this.currentNetwork) {
      throw Error('Contract not deployed on DAppChain')
    }

    const ABI = ChatRoom.abi
    this.chatRoomInstance = new this.web3.eth.Contract(ABI, this.currentNetwork.address, {
      from: this.currentUserAddress
    })

    this.chatRoomInstance.events.SendText({
      fromBlock: 0,
      toBlock: 'latest'
    }, (err, event) => {
      if (err) console.error('Error on event', err)
      else {
        if (this.onEvent) {
          this.onEvent(event.returnValues)
        }
      }
    })

    this.chatRoomInstance.events.MintColorStampToken({
      fromBlock: 0,
      toBlock: 'latest'
    }, (err, event) => {
      if (err) console.error('Error on event', err)
      else {
        if (this.onMintColorStampToken) {
          this.onMintColorStampToken(event.returnValues)
        }
      }
    })

  }

  addEventListener(fn) {
    this.onEvent = fn
  }
  addOnMintColorStampToken(fn) {
    this.onMintColorStampToken = fn
  }

  async _getCurrentNetwork() {
    return await this.web3.eth.net.getId()
  }

  async sendText(text) {
    return await this.chatRoomInstance.methods.sendText(text).send({
      from: this.currentUserAddress
    })
  }

    async sendStamp(stamp) {
    return await this.chatRoomInstance.methods.sendStamp(stamp).send({
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

  async getColorStampCount() {
    return await this.chatRoomInstance.methods.balanceOf(this.currentUserAddress).send({ from: this.currentUserAddress })
  }

  async mintColorStampToken() {
    return await this.chatRoomInstance.methods.mintColorStampToken().send({ from: this.currentUserAddress })
  }
}
