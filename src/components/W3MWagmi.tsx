import React from 'react'
import { Web3Button } from '@web3modal/react'
import { useSignMessage, useAccount } from 'wagmi'

const W3MWagmi = () => {

  const { isConnected } = useAccount()
  
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: 'gm wagmi frens',
  })

  console.log("signature: ", data)

  return (
    <div className='flex-container' >
       <h3>Sign with other Wallet: </h3>
      <Web3Button />
      { isConnected && 
        <div>
          <button disabled={isLoading} onClick={() => signMessage()}>
            Sign message
          </button>
          {isSuccess && <div>Success</div>}
          {isError && <div>Error signing message</div>}
        </div>
      } 
    </div>
  )
}

export default W3MWagmi