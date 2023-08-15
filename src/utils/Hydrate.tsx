import { ReactNode } from "react";
import dynamic from 'next/dynamic'

//React component that simply returns its children
const Client = ({ children }:{ children: ReactNode })=>children

//Dinamic import of the Client component
export const Hydrate = dynamic(()=>Promise.resolve(Client), {
  ssr: false //disabling server side rendering feature
})