import { TranslateResponse } from "../../interfaces"

export const translatorUseCase = async (prompt: string, lang: string) => {
  try {

    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translator`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({prompt, lang})
    })

    if(!resp.ok) throw new Error('No Se pudo realizar la traducción')

    const data = await resp.json() as TranslateResponse

    return{
      ok: true,
      ...data
    }
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo realizar la traduccion",
    }
  }
}
