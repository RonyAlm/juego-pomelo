import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import questionsData from './data/questions.json'
import logoPomelo from './assets/logo.png'
import logoPaippa from './assets/logo-paippa.png'
import hero from './assets/hero.png'
import SectionHome from './component/SectionHome'

type Question = {
  id: number
  question: string
  options: string[]
  answer: string
}

type Prize = {
  id: number
  label: string
  color: string
  image: string
}

const MAX_QUESTIONS = 6

function getRandomQuestions(items: Question[], count = MAX_QUESTIONS) {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, Math.min(count, shuffled.length))
}

function App() {
  const [questions, setQuestions] = useState<Question[]>(() => getRandomQuestions(questionsData as Question[]))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [showWheel, setShowWheel] = useState(false)
  const [prize, setPrize] = useState<Prize | null>(null)
  const [pendingPrize, setPendingPrize] = useState<Prize | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const currentQuestion = questions[currentIndex]
  const progress = useMemo(() => ((currentIndex + (selectedAnswer ? 1 : 0)) / questions.length) * 100, [currentIndex, questions.length, selectedAnswer])

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return

    setSelectedAnswer(option)

    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      setIsFinished(true)
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setSelectedAnswer(null)
  }

  const handleRestart = () => {
    setQuestions(getRandomQuestions(questionsData as Question[]))
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setIsFinished(false)
    setShowWheel(false)
    setPrize(null)
    setIsSpinning(false)
    setHasStarted(false)
  }

  const prizes: Prize[] = [
    { id: 1, label: 'Formosa Hermosa', color: '#127ee4', image: logoPomelo },
    { id: 2, label: 'Pomelo', color: '#adaf19', image: hero },
    { id: 3, label: 'Paippa', color: '#0ba806', image: logoPaippa },
    { id: 4, label: 'Turismo', color: '#0bf588', image: hero },
  ]

  const spinWheel = () => {
    if (isSpinning) return

    const randomIndex = Math.floor(Math.random() * prizes.length)
    const selectedPrize = prizes[randomIndex]
    const segmentAngle = 360 / prizes.length
    const segmentCenter = randomIndex * segmentAngle + segmentAngle / 2
    const currentRotation = ((rotation % 360) + 360) % 360
    const alignmentPoint = 270
    const extraTurns = 5 + Math.floor(Math.random() * 3)
    const targetRotation = (alignmentPoint - (segmentCenter + currentRotation) + 360) % 360 + 360 * extraTurns

    setPendingPrize(selectedPrize)
    setPrize(null)
    setRotation((prev) => prev + targetRotation)
    setIsSpinning(true)
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <main className="w-full h-screen bg-green-700 px-4 py-10 text-white flex items-center justify-center">
      <div className="w-full md:min-w-2xl mx-auto flex max-w-3xl flex-col gap-6 py-8 px-4
       rounded-3xl border-2 border-zinc-800 bg-stone-100/75 shadow-[8px_8px_0px_#0a2d16] backdrop-blur-md sm:p-8">
        {!hasStarted ? (
          <SectionHome setHasStarted={setHasStarted} />
        ) : (
          <>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span className="rounded-full bg-green-600 px-3 py-1 font-medium">Quiz de Turimo Formosa</span>
              <span className="text-zinc-800">{currentIndex + 1}/{questions.length}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full text-shadow-blue-950 bg-green-600 transition-all" style={{ width: `${progress}%` }} />
            </div>

            {isFinished ? (
              <AnimatePresence mode="wait">
                <motion.section
                  key={showWheel ? 'wheel' : 'result'}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4 text-center"
                >
                  {!showWheel ? (
                    <>
                      <h1 className="text-green-700 text-3xl font-bold">¡Quiz terminado!</h1>
                      <p className="text-green-600">
                        Obtuviste <span className="font-semibold ">{score}</span> de  <span className="font-semibold">{questions.length}</span> respuestas correctas.
                      </p>
                      <p className="text-sm text-slate-800">Ahora puedes girar la ruleta de premios.</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <button
                          onClick={() => setShowWheel(true)}
                          className="rounded-full bg-green-600 px-5 py-2 font-semibold text-white 
                           transition hover:bg-green-600/80 cursor-pointer"
                        >
                          Girar ruleta
                        </button>
                        <button
                          onClick={handleRestart}
                          className="rounded-full border border-green-600 px-5 py-2 font-semibold
                           text-green-600 transition hover:bg-white/10 cursor-pointer"
                        >
                          Volver al inicio
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="relative p-4">
                          <div className="absolute left-1/2 top-6 z-30 h-0 w-0 -translate-x-1/2 -translate-y-full border-l-14 border-r-14 border-t-24 
                          border-l-transparent border-r-transparent border-t-green-950 shadow-[0_0_10px_rgba(17, 155, 58, 0.8)]" />
                          <svg viewBox="0 0 340 340" className="h-85 w-85">
                            <defs>
                              <clipPath id="logoCircleClip">
                                <circle cx="170" cy="170" r="34" />
                              </clipPath>
                            </defs>
                            <circle cx="170" cy="170" r="164" fill="rgba(22, 175, 17, 0.05)" stroke="rgba(12, 155, 24, 0.18)" strokeWidth="4" />
                            <motion.g
                              animate={{ rotate: rotation }}
                              transition={{ duration: 3.2, ease: 'easeOut' }}
                              style={{ transformOrigin: '170px 170px' }}
                              onAnimationComplete={() => {
                                if (isSpinning && pendingPrize) {
                                  setPrize(pendingPrize)
                                  setPendingPrize(null)
                                  setIsSpinning(false)
                                }
                              }}
                            >
                              {prizes.map((prizeItem, index) => {
                                const segmentAngle = 360 / prizes.length
                                const startAngle = index * segmentAngle
                                const endAngle = startAngle + segmentAngle
                                const radius = 160
                                const startRadians = (Math.PI / 180) * startAngle
                                const endRadians = (Math.PI / 180) * endAngle
                                const x1 = 170 + radius * Math.cos(startRadians)
                                const y1 = 170 + radius * Math.sin(startRadians)
                                const x2 = 170 + radius * Math.cos(endRadians)
                                const y2 = 170 + radius * Math.sin(endRadians)
                                const path = `M170 170 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`
                                const textAngle = startAngle + segmentAngle / 2
                                // const textRadius = radius * 0.65
                                const iconRadius = radius * 0.55
                                // const textX = 170 + textRadius * Math.cos((Math.PI / 180) * textAngle)
                                // const textY = 170 + textRadius * Math.sin((Math.PI / 180) * textAngle)
                                const iconX = 170 + iconRadius * Math.cos((Math.PI / 180) * textAngle)
                                const iconY = 170 + iconRadius * Math.sin((Math.PI / 180) * textAngle)
                                return (
                                  <g key={prizeItem.id}>
                                    <path d={path} fill={prizeItem.color} stroke="#0f172a" strokeWidth="2" />
                                    <image
                                      href={prizeItem.image}
                                      x={iconX - 23}
                                      y={iconY - 23}
                                      width="46"
                                      height="46"
                                      preserveAspectRatio="xMidYMid meet"
                                    />
                                    {/* <text
                                      x={textX}
                                      y={textY}
                                      fill="#ffffff"
                                      fontSize="12"
                                      fontWeight="600"
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      {prizeItem.label}
                                    </text> */}
                                  </g>
                                )
                              })}
                              <circle cx="170" cy="170" r="42" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="4" />
                            </motion.g>
                            <image
                              href={logoPomelo}
                              x="136"
                              y="136"
                              width="70"
                              height="70"
                              preserveAspectRatio="xMidYMid meet"
                              clipPath="url(#logoCircleClip)"
                            />
                          </svg>
                        </div>
                      </div>

                    <div className="flex justify-center items-center gap-4">

                      <motion.button
                        onClick={spinWheel}
                        disabled={isSpinning}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-full bg-green-700 px-6 py-3 font-semibold text-white
                         shadow-[0_0_25px_rgba(4, 209, 38, 0.35)] transition disabled:cursor-not-allowed
                          disabled:opacity-70">
                        {isSpinning ? 'Girando...' : 'Girar'}
                      </motion.button>

                      <button
                        onClick={handleRestart}
                        className="rounded-full border border-green-700 px-5 py-2 font-semibold text-green-700 transition hover:bg-white/10"
                      >
                        Volver al inicio
                      </button>

                     </div>

                      { prize && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-2xl bg-green-700 p-4 text-sm text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                        >
                          <p className="text-lg font-semibold">¡Premio ganado!</p>
                          <div className="my-3 flex flex-col items-center gap-3">
                            <img
                              src={prize.image}
                              alt={prize.label}
                              className="w-16"
                            />
                            
                              <p className="text-base font-semibold text-white">{prize.label}</p>
                              <p className="text-sm text-emerald-100/80">¡Lo ganaste en la ruleta!</p>
                            
                          </div>
                        </motion.div>
                      )}

                    </div>
                  )}
                </motion.section>
              </AnimatePresence>
            ) : (
              <section className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-green-900 text-2xl font-semibold sm:text-3xl">{currentQuestion.question}</h1>
                  <p className="text-sm text-green-950">Elige la opción correcta.</p>
                </div>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option) => {
                    const isCorrect = option === currentQuestion.answer
                    const isSelected = selectedAnswer === option
                    const isWrongSelected = selectedAnswer && isSelected && !isCorrect

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className={`text-green-800 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                          isWrongSelected
                            ? 'border-rose-500 bg-white/80 text-rose-500'
                            : isSelected && isCorrect
                              ? 'border-emerald-500 bg-green-500/20 text-emerald-200'
                              : 'border-white/10 bg-white/80 hover:border-green-600'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>

                {selectedAnswer && (
                  <div className="rounded-2xl border border-white/10 bg-green-600 p-4 text-sm text-slate-200">
                    <p className="font-semibold text-green-950">
                      {selectedAnswer === currentQuestion.answer ? '¡Correcto!' : 'Respuesta incorrecta.'}
                    </p>
                    <p className="mt-1">La respuesta correcta es: <span className="font-semibold text-white">{currentQuestion.answer}</span></p>
                    <button
                      onClick={handleNext}
                      className="mt-4 rounded-full bg-green-500 px-4 py-2 font-semibold text-white transition hover:bg-green-900 cursor-pointer"
                    >
                      {currentIndex === questions.length - 1 ? 'Ver resultado' : 'Siguiente pregunta'}
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default App
