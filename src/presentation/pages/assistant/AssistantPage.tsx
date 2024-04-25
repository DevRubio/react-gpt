import { useState, useEffect } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components"
import { createThreadUseCase, postQuestionUseCase } from '../../../core/use-cases';

interface Message{
  text: string
  isGpt: boolean
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [threadId, setThreadId] = useState<string>()
  
  useEffect(() => {
    const threadId = localStorage.getItem('threadId')

    if(threadId){
      setThreadId(threadId)
    }else{
      createThreadUseCase()
        .then(id =>{
          setThreadId(id)
          localStorage.setItem('threadId',id)
        })
    }  
  }, [])

  useEffect(() => {
    if(threadId) {
      console.log(`Numero de threas ${threadId}`)
    }
  }, [threadId])
  

  const handlePost = async(text: string)=>{
    if ( !threadId ) return
    setIsLoading(true)
    setMessages((prev)=>[...prev,{text: text, isGpt: false}])

    //Use Case   

    const replies = await postQuestionUseCase(threadId, text)

    setIsLoading(false)

    for (const reply of replies) {
      for (const message of reply.content) {
        setMessages((prev)=>[
          ...prev,
          {text: message, isGpt:(reply.role ==='assistant'), info:reply}
        ])
      }
      
    }

  }
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">


          {/*Bienvenida */}
          <GptMessage text="Buen Dia. Soy CoreGw-Bot🤖, ¿En que puedo ayudarte hoy?"/>
          {
            messages.map((message, index)=>(
              message.isGpt
                ?(
                  <GptMessage key={index} text={message.text}/>
                )
                :(
                  <MyMessage key={index} text={message.text}/>
                )
                
            ))
          }
          {
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
        placeholder="Escribe aqui lo que deseas"
        disbleCorrections
      />
    </div>
  )
}
