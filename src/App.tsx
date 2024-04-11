import React from 'react'

import { Button } from './components/Button'
import { Counter } from './components/Counter'
import { useEvent } from './hooks/useEvent'

function App (): JSX.Element {
  const [text, setText] = React.useState('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value)
  }

  const onClick = useEvent((): void => {
    console.log('send text', text)
  })

  return (
    <>
      {text}
      <Counter />
      <input type="text" onChange={onChange} />
      <Button onClick={onClick}/>
    </>
  )
}

export default App
