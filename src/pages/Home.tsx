import { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';

import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImage from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss'; 

export function Home() {
  const histoty = useHistory();
  const { signInWithGoogle, user} = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    histoty.push('/rooms/new');
  };

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exist');
      return;
    }

    histoty.push(`/rooms/${roomCode}`);
  };

  return (
    <div id="page-auth">
      <aside>
        <img src={ illustrationImg } alt="Ilustração simbolizando perguntas e responstas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={ logoImg } alt="Letmeask" />
          <button onClick={ handleCreateRoom } className="create-room">
            <img src={ googleIconImage } alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator"> Ou entre em uma outra sala</div>
          <form onSubmit={ handleJoinRoom  }>
            <input
            type="text"
            placeholder="Digite o código da sala"
            onChange={ event => setRoomCode(event.target.value) }
            value={ roomCode }
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}