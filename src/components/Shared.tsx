import React, { useEffect, useState } from 'react'
import { Core } from "@walletconnect/core";
import SignClient from "@walletconnect/sign-client";
import AuthClient, { generateNonce } from '@walletconnect/auth-client'
import { WalletConnectModal } from '@walletconnect/modal'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!
const modal = new WalletConnectModal({ projectId })

const Shared = () => {

  const [signClient, setSignClient] = useState<InstanceType<typeof SignClient>>()
  const [authClient, setAuthClient] = useState<InstanceType<typeof AuthClient>>()

  useEffect(()=>{
    async function init(){
      // First instantiate a separate `Core` instance.
      const core = new Core({
        projectId,
      });

      const metadata = {
        name: "Example Dapp",
        description: "Example Dapp",
        url: "#",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      };
      // Pass `core` to the SignClient on init.
      const signClient_ = await SignClient.init({ core, metadata });
      setSignClient(signClient_)

      // Pass `core` to the AuthClient on init.
      const authClient_ = await AuthClient.init({ core, projectId, metadata });      
      authClient_.on('auth_response', ({ params }) => {
        console.log(params)
        modal.closeModal()
      })
      setAuthClient(authClient_)
    }

    init()
  },[])

  const handleAuth = async ()=>{
    if(!authClient) throw new Error('Auth Client is undefined')
    const { uri } = await authClient.request({
      aud: 'http://localhost:3000/',
      domain: 'localhost',
      chainId: 'eip155:1',
      type: 'eip4361',
      nonce: generateNonce()
    })
    await modal.openModal({ uri })
  }

  return (
    <div>
      <button onClick={handleAuth} >Auth</button>
    </div>
  )
}

export default Shared