import { FormEvent, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { notifyError } from '../components/Notification'
import { useAuth } from '../hooks/useAuth'

import '../styles/room.scss'
import { database } from '../services/firebase'
import { useEffect } from 'react'

type FirebaseQuestions = Record<string, {
  content: string
  author: {
    name: string
    avatar: string
  },
  isHighLighted: boolean
  isAnsewered: boolean
}>

type Question = {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  },
  isHighLighted: boolean
  isAnsewered: boolean
}

type RoomParams = {
  id: string
}

export function Room() {
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')

  const roomId = params.id

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    // TODO: otimizar carregamento
    // https://firebase.google.com/docs/database/admin/retrieve-data#section-event-types
    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighLighted: value.isHighLighted,
          isAnsewered: value.isAnsewered,
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId])

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return
    }

    if (!user) {
      notifyError("Você precisa estar logado")
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar
      },
      isHighLighted: false,
      isAnsewered: false,
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }
  
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask"/>
          </Link>
          <RoomCode code={roomId}/>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta{questions.length !== 1 && 's'}</span> }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
        <div>{ JSON.stringify(questions) }</div>
      </main>
    </div>
  )
}