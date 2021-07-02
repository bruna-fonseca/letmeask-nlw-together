import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { database } from '../services/firebase';

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isHighlighted: boolean;
  isAnswer: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isHighlighted: boolean;
  isAnswer: boolean;
  likeCount: number;
  hasLiked: string | undefined;
}

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestion: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestion).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswer: value.isAnswer,
          likeCount: Object.values(value.likes ?? {}).length,
          hasLiked: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
        };
      });

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);      
    });
    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id]);

  return { questions, title}
};