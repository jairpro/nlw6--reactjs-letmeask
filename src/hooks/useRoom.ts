import { useEffect } from "react"
import { useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type FirebaseQuestions = Record<string, {
  content: string
  author: {
    name: string
    avatar: string
  },
  isHighLighted: boolean
  isAnsewered: boolean
  likes: Record<string, {
    authorId: string
  }>
}>

type QuestionType = {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  },
  isHighLighted: boolean
  isAnsewered: boolean
  likeCount: number
  likeId: string | undefined
}

export function useRoom(roomId: string) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')
  const [authorId, setAuthorId] = useState('')

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
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        }
      })
      
      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
      setAuthorId(databaseRoom.authorId)
    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])

  return { questions, title, authorId }
}