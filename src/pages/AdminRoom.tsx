import { useParams, Link, useHistory } from 'react-router-dom'
import cx from 'classnames'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import { Button } from '../components/Button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
// import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import '../styles/room.scss'
import { useOptions } from '../hooks/useOptions'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  // const { user } = useAuth()
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id

  const { title, questions, authorId } = useRoom(roomId)
  const { userOptions: authorOptions } = useOptions(authorId)
  console.log(authorOptions)
  
  async function handleEndRoom() {
    if (window.confirm("Tem certeza que deseja encerrar essa sala?")) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date()
      })

      history.push('/')
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string, isAnsewered: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnsewered
    })
  }
  
  async function handleHighlightQuestion(questionId: string, isHighLighted: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted
    })
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="Letmeask"/>
          </Link>
          <div>
            <RoomCode code={roomId}/>
            <Button
              onClick={handleEndRoom}
              isOutlined
            >
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta{questions.length !== 1 && 's'}</span> }
        </div>
        
        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnsewered={question.isAnsewered}
                isHighlighted={question.isHighLighted}
              >
                { (authorOptions?.showAnseweredQuestionsInfo || !question.isAnsewered) && (
                  <>
                    <button
                    className={cx(
                      'button-ansewer',
                      { checked: question.isAnsewered },
                    )}
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id, !question.isAnsewered)}
                    title="Marcar pergunta como respondida"
                  > 
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className={cx(
                      'button-highlight',
                      { checked: question.isHighLighted }
                    )}
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id, !question.isHighLighted)}
                    title="Dar destaque à pergunta"
                  > 
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                  title="Remover pergunta"
                > 
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
