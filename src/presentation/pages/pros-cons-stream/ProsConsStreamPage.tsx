import { useRef, useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { prosConsStreamGeneratorUseCase } from "../../../core/use-cases"

interface Message{
  text: string
  isgpt: boolean
}

export const ProsConsStreamPage = () => {

  const abortController = useRef(new AbortController())

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const isRunning = useRef(false)

  const handlePost = async(text:string)=>{

    if (isRunning.current){
      abortController.current.abort
      abortController.current = new AbortController()
    }

    setIsLoading(true)
    isRunning.current = true    
    setMessages((prev)=>[...prev,{text: text, isgpt: false}])


    
    const stream = prosConsStreamGeneratorUseCase(text, abortController.current.signal)
    setIsLoading(false)

    setMessages((messages)=>[...messages,{text: '', isgpt: true}])

    for await (const text of stream){
      setMessages((messages)=>{
        const newMessages = [...messages]
        newMessages[newMessages.length-1].text = text
        return newMessages
      })
    }
    isRunning.current = false


  }
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/*Bienvenida */}
          <GptMessage text="¿Que deseas comparar hoy?"/>
          {
            messages.map((message, index)=>(
              message.isgpt
                ?(
                  <GptMessage key={index} text={message.text}/>
                )
                :(
                  <MyMessage key={index} text={message.text}/>
                )
            ))
          }{
            isLoading &&(
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader className="fade-in"/>
              </div>
            )
          }
        </div>
      </div>
      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="¿Que deseas comparar hoy?"        
      />
    </div>
  )
}
