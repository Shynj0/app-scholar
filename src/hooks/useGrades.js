import { useState } from 'react';

export const useGrades = () => {
  const [grades, setGrades] = useState([
    {
      id: 1,
      disciplina: 'Programação I',
      nota1: 8.5,
      nota2: 9.0,
      media: 8.75,
      situacao: 'Aprovado',
    },
    {
      id: 2,
      disciplina: 'Banco de Dados',
      nota1: 7.5,
      nota2: 8.0,
      media: 7.75,
      situacao: 'Aprovado',
    },
    {
      id: 3,
      disciplina: 'Engenharia de Software',
      nota1: 6.0,
      nota2: 5.5,
      media: 5.75,
      situacao: 'Reprovado',
    },
  ]);

  const getSituacao = (media) => {
    if (media >= 7.0) return 'Aprovado';
    if (media >= 5.0) return 'Recuperação';
    return 'Reprovado';
  };

  const addGrade = (gradeData) => {
    const media = (gradeData.nota1 + gradeData.nota2) / 2;
    const newGrade = {
      id: grades.length + 1,
      ...gradeData,
      media: parseFloat(media.toFixed(2)),
      situacao: getSituacao(media),
    };
    setGrades([...grades, newGrade]);
    return newGrade;
  };

  const updateGrade = (id, gradeData) => {
    const media = (gradeData.nota1 + gradeData.nota2) / 2;
    setGrades(grades.map(g => g.id === id ? {
      ...g,
      ...gradeData,
      media: parseFloat(media.toFixed(2)),
      situacao: getSituacao(media),
    } : g));
  };

  return { grades, addGrade, updateGrade, getSituacao };
};