import { useState } from 'react';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      nome: 'Programação I',
      cargaHoraria: '60 horas',
      professorResponsavel: 'Dr. Carlos Ferreira',
      curso: 'Engenharia de Software',
      semestre: '1º Semestre',
    },
    {
      id: 2,
      nome: 'Banco de Dados',
      cargaHoraria: '60 horas',
      professorResponsavel: 'Dra. Ana Paula',
      curso: 'Engenharia de Software',
      semestre: '2º Semestre',
    },
    {
      id: 3,
      nome: 'Engenharia de Software',
      cargaHoraria: '80 horas',
      professorResponsavel: 'Dr. Carlos Ferreira',
      curso: 'Engenharia de Software',
      semestre: '3º Semestre',
    },
  ]);

  const addSubject = (subjectData) => {
    const newSubject = {
      id: subjects.length + 1,
      ...subjectData,
    };
    setSubjects([...subjects, newSubject]);
    return newSubject;
  };

  const updateSubject = (id, subjectData) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...subjectData } : s));
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return { subjects, addSubject, updateSubject, deleteSubject };
};