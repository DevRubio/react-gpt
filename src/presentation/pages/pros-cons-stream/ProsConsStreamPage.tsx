import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { prosConsStreamGeneratorUseCase } from "../../../core/use-cases"

interface Message{
  text: string
  isgpt: boolean
}

export const ProsConsStreamPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async(text:string)=>{
    setIsLoading(true)
    setMessages((prev)=>[...prev,{text: text, isgpt: false}])
/* 
    const reader = await prosConsStreamUseCase(text)
    setIsLoading(false)
    if(!reader) return alert('No se pudo generar el reader')

    const decoder = new TextDecoder()
    let message = ''
    setMessages((messages) =>[...messages, {text: message, isgpt: true}])

    while(true){

      const {value, done} = await reader.read()
      if(done) break
      const decodedChunk = decoder.decode(value, {stream: true})
      message += decodedChunk

      setMessages((messages)=>{
        const newMessages = [...messages]
        newMessages[newMessages.length-1].text = message
        return newMessages
      })
    } 
    */

    const stream = await prosConsStreamGeneratorUseCase(text)
    setIsLoading(false)

    setMessages((messages)=>[...messages,{text: '', isgpt: true}])

    for await (const text of stream){
      setMessages((messages)=>{
        const newMessages = [...messages]
        newMessages[newMessages.length-1].text = text
        return newMessages
      })
    }


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
