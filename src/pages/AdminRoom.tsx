import { useParams, useHistory } from 'react-router-dom';

// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Questions } from '../components/Questions';

import '../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);
  
  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    history.push('/');
  };

  async function handleDeleteQuestion(questionId: string) {
   if (window.confirm('Tem certeza que deseja deletar esse pergunta?')) {
      const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
   }
  };

  async function handleCheckAnsweredQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswer: true,
    });

  };

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  };

  return (
   <div id="page-room">
     <header>
       <div className="content">
         <img src={ logoImg } alt="letmeask logo" />
         <div>
            <RoomCode code={ roomId }/>
            <Button onClick={ handleEndRoom } isOutlined>Encerrar sala</Button>
         </div>
       </div>
     </header>
     <main className="content">
       <div className="room-title">
         <h1>Sala {title}</h1>
         { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
       </div>
       <div className="question-list">
        {questions.map((question) => {
          return (
            <Questions
              content={ question.content }
              author={ question.author }
              key={ question.id }
              isAnswer={ question.isAnswer }
              isHighlighted={ question.isHighlighted }
            >
              {!question.isAnswer && (
                <>
                <button
                  type='button'
                  onClick={ () => handleCheckAnsweredQuestion(question.id)}
              >
                <img src={ checkImg } alt="Marca pergunta como respondida" />
              </button>
              <button
                  type='button'
                  onClick={ () => handleHighlightQuestion(question.id)}
              >
                <img src={ answerImg } alt="Destacar pergunta a ser respondida" />
              </button>
              </>
              )}
              <button
                type='button'
                onClick={ () => handleDeleteQuestion(question.id)}
              >
                <img src={ deleteImg } alt="Remover pergunta" />
              </button>
            </Questions>
          )
        })}
       </div>
     </main>
   </div>
  )
};
