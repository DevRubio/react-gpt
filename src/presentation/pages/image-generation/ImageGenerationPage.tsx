import { useState } from "react"
import { GptMessage, GptMessageImage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { imageGenerationUseCase } from '../../../core/use-cases/image-generation.use-case';

interface Message{
  text: string
  isGpt: boolean
  info?:{
    imageUrl: string
    alt: string
  }
}


export const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async(text: string)=>{
    setIsLoading(true)
    setMessages((prev)=>[...prev,{text: text, isGpt: false}])

    //Use Case   
    const imageInfo = await imageGenerationUseCase(text)

    if(!imageInfo){
      return setMessages((prev)=>[...prev,{text:'No se pudo generar la imagen ', isGpt: true}])
    }

    setMessages(prev=>[
      ...prev,{
        text: text,
        isGpt: true,
        info:{
          imageUrl: imageInfo.url,
          alt: imageInfo.alt
        }
      }
    ])
setIsLoading(false)
  }
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/*Bienvenida */}
          <GptMessage text="Hola, ¿Que imagen vamos a generar hoy?" />
          {
            messages.map((message, index)=>(
              message.isGpt
                ?(
                  <GptMessageImage key={index} text={message.text} imageUrl={message.info?.imageUrl!} alt={message.info?.alt!}/>
                )
                :(
                  <MyMessage key={index} text={message.text}/>
                )
            ))
          }
          {
            isLoading &&(
              <div className="col-start-1 col-end-12 fade-ind">
                <TypingLoader className="fade-in"/>
              </div>
            )
          }
        </div>
      </div>
      <TextMessageBox 
        onSendMessage={handlePost}
        placeholder="¿Que imagen vamos a generar hoy?"
      />
    </div>
  )
}
