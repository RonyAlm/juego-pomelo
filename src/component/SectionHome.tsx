import React from 'react'
import logo from '../assets/logo.png'

const SectionHome = ({setHasStarted} : {setHasStarted: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
        <section className=" flex flex-col items-center justify-center gap-4 py-8 text-center">
            <div className="flex h-full items-center justify-center">
              <img src={logo} alt="Logo Pomelo" className='w-60 md:w-80' />
            </div>
            
              <p className="mt-4 font-[Sora] font-bold text-3xl text-green-950">
                Juego de preguntas <br /> y respuestas.
              </p>
            
            <button
              onClick={() => setHasStarted(true)}
              className="font-[Sora] mt-6 bg-green-600 rounded-2xl border-2 border-zinc-800 shadow-[4px_4px_0px_#0a2d16] px-6 py-3 text-lg font-semibold
               text-green-950 transition hover:bg-green-600 cursor-pointer">
              Jugar ahora
            </button>
          </section>
  )
}

export default SectionHome