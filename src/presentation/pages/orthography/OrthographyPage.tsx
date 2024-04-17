import { useState } from "react"
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { orthographyUseCase } from '../../../core/use-cases/orthography.use-case';

interface Message{
  text: string
  isGpt: boolean
  info?:{
    userScore: number
    errors: string[]
    message: string
  }
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async(text: string)=>{
    setIsLoading(true)
    setMessages((prev)=>[...prev,{text: text, isGpt: false}])

    //Use Case   
    const { ok, errors, message, userScore } = await orthographyUseCase(text);
    if ( !ok ) {
      setMessages( (prev) => [...prev, { text: 'No se pudo realizar la corrección', isGpt: true }] );
    } else {
      setMessages( (prev) => [...prev, { 
        text: message, isGpt: true,  
        info: {errors,message,userScore}
      }]);
    }
    setIsLoading(false)

  }
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">


          {/*Bienvenida */}
          <GptMessage text="Hola, puedes escribir tu texto en español y te ayudo con las correciones"/>
          {
            messages.map((message, index)=>(
              message.isGpt
                ?(
                <GptOrthographyMessage 
                    key={ index }  
                    { ...message.info! }
                  />
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
