import getDefaultProps from 'components/getDefaultProps'
import Wrapper from 'components/wrapper/Wrapper'
import { InferGetServerSidePropsType } from 'next'

function Marketplace() {
  return (
    <div>
      <p>Hello from marketplace3</p>
      <p>This is another message2</p>
    </div>
  )
}

export default function Outer({ config }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Wrapper page='marketplace' title='Marketplace' config={config}>
      <Marketplace />
    </Wrapper>
  )
}

export const getServerSideProps = getDefaultProps
