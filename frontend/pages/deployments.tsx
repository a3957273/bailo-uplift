import getDefaultProps from 'components/getDefaultProps'
import Wrapper from 'components/wrapper/Wrapper'
import { InferGetServerSidePropsType } from 'next'

function Deployments() {
  return <p>Hello from deployments4</p>
}

export default function Outer({ config }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Wrapper page='deployments' title='Deployments' config={config}>
      <Deployments />
    </Wrapper>
  )
}

export const getServerSideProps = getDefaultProps
