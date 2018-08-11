const ChatRoom = artifacts.require('ChatRoom');

contract('ChatRoom', (accounts) => {
  let chatRoom

  beforeEach(async () => {
    chatRoom = await ChatRoom.new()
  })

  it('Should have an address for ChatRoom', async () => {
    assert(chatRoom.address)
  });

  it('メッセージを送信できる', async () => {
      const message = 'a'
      const tx = await chatRoom.sendMessage(message, {from: accounts[0]})
      assert.equal(tx.logs[0].args.message, message)
  })
  it('メッセージの総数を取得できる', async () => {
      await chatRoom.sendMessage('a', {from: accounts[0]})
      await chatRoom.sendMessage('a', {from: accounts[0]})
      const count = await chatRoom.getMessagesCount.call({from: accounts[0]})
      assert.equal(count.toNumber(), 2)
  })

  it('メッセージを取得できる', async () => {
    await chatRoom.sendMessage('a', {from: accounts[0]})
    await chatRoom.sendMessage('b', {from: accounts[0]})

    assert.equal(await chatRoom.getMessage.call(accounts[0], 0), 'a')
    assert.equal(await chatRoom.getMessage.call(accounts[0], 1), 'b')
  })

  it('ユーザ一覧を取得できる', async() => {
    await chatRoom.sendMessage('a', {from: accounts[0]})
    await chatRoom.sendMessage('b', {from: accounts[1]})

    const users = await chatRoom.getUsers.call()
    assert.equal(accounts[0], users[0])
    assert.equal(accounts[1], users[1])
  })
})
