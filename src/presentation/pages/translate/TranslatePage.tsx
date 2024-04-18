import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components"
import { translatorUseCase } from '../../../core/use-cases/translator-use-case';

interface Message{
  text: string
  isGpt: boolean
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];


export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text: string, seletedOption: string)=>{
    setIsLoading(true)

    const newMessage = `Traduce: "${text}" al idioma ${seletedOption}`
    setMessages((prev)=>[...prev,{text: newMessage, isGpt: false}])

    //Use Case
    const {ok, message } = await translatorUseCase(newMessage, seletedOption)
    if(!ok){
      setMessages((prev)=>[...prev,{text: "No se pudo realizar la tradución", isGpt: true}])
    }else{
      setMessages((prev)=>[...prev,{
        text: message, isGpt: true        
      }])
    }

    setIsLoading(false)
  }
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="gird grid-cols-12 gap-y-2">
          <GptMessage text="Hola, ¿Que deseas traducir hoy?"/>
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
          }{
            isLoading &&(
              <div className="col-start-1 col-en-12 fade-in">
                <TypingLoader className="fade-in"/>
              </div>
            )
          }
        </div>
      </div>
      <TextMessageBoxSelect
        onSendMessage={handlePost}
        options={languages}
      />
    </div>
  )
}
