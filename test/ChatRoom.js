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
      const text = 'a'
      const tx = await chatRoom.sendText(text, {from: accounts[0]})
  })
  it('メッセージの総数を取得できる', async () => {
      await chatRoom.sendText('a', {from: accounts[0]})
      await chatRoom.sendText('a', {from: accounts[0]})
      const count = await chatRoom.getMessagesCount.call({from: accounts[0]})
      assert.equal(count.toNumber(), 2)
  })

  it('メッセージを取得できる', async () => {
    await chatRoom.sendText('a', {from: accounts[0]})
    await chatRoom.sendText('b', {from: accounts[0]})

    {
        const [ text, timestamp ] = await chatRoom.getMessage.call(accounts[0], 0)
        assert.equal(text, 'a')
    }
    {
        const [ text, timestamp ] = await chatRoom.getMessage.call(accounts[0], 1)
        assert.equal(text, 'b')
    }
  })

  it('ユーザ一覧を取得できる', async() => {
    await chatRoom.sendText('a', {from: accounts[0]})
    await chatRoom.sendText('b', {from: accounts[1]})

    const users = await chatRoom.getUsers.call()
    assert.equal(accounts[0], users[0])
    assert.equal(accounts[1], users[1])
  })

  it('トークンを発行できる', async() => {
      await chatRoom.mintColorStampToken({from: accounts[0]})
      await chatRoom.mintColorStampToken({from: accounts[0]})
      await chatRoom.mintColorStampToken({from: accounts[0]})
      const count1 = await chatRoom.balanceOf.call(accounts[0])
      const count2 = await chatRoom.balanceOf.call(accounts[1])
      assert.equal(count1.toNumber(), 3)
      assert.equal(count2.toNumber(), 0)
  })
})
