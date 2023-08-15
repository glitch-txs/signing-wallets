import React from 'react'
import { useEffect, useState } from 'react'
import AuthClient, { generateNonce } from '@walletconnect/auth-client'
import { WalletConnectModal } from '@walletconnect/modal'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!

const modal = new WalletConnectModal({ projectId })

const Auth = () => {
  const [authClient, setAuthClient] = useState<InstanceType<typeof AuthClient>>()
  const [signed, setSigned] = useState<string>()

  useEffect(()=>{
    async function initAuth(){
      const _authClient = await AuthClient.init({
        projectId,
        metadata: {
          name: 'my-auth-dapp',
          description: 'A dapp using WalletConnect AuthClient',
          url: 'my-auth-dapp.com',
          icons: ['https://my-auth-dapp.com/icons/logo.png']
        }
      })
      _authClient.on('auth_response', ({ params }) => {
        //@ts-ignore - type needs fix on our end
        if (Boolean(params.result?.s)) {
          // Response contained a valid signature -> user is authenticated.
        //@ts-ignore - type needs fix on our end
        console.log(params.result.s)
        setSigned('Success')
        } else {
          // Handle error or invalid signature case
          console.error(params)
          setSigned('Error')
        }
        modal.closeModal()  
      })
      setAuthClient(_authClient)
    }

    initAuth()
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
    <div className='flex-container' >
      { ["Trust Wallet", "Rainbow"].map( v => <button key={v} onClick={handleAuth} >Sign with {v}</button> ) }
      {
        signed
      }
    </div>
  )
}

export default Auth