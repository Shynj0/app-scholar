import { useState } from 'react';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      nome: 'Dr. Carlos Ferreira',
      titulacao: 'Doutorado',
      areaAtuacao: 'Engenharia de Software',
      tempoDocencia: '15 anos',
      email: 'carlos@example.com',
    },
    {
      id: 2,
      nome: 'Dra. Ana Paula',
      titulacao: 'Mestrado',
      areaAtuacao: 'Banco de Dados',
      tempoDocencia: '8 anos',
      email: 'ana@example.com',
    },
  ]);

  const addTeacher = (teacherData) => {
    const newTeacher = {
      id: teachers.length + 1,
      ...teacherData,
    };
    setTeachers([...teachers, newTeacher]);
    return newTeacher;
  };

  const updateTeacher = (id, teacherData) => {
    setTeachers(teachers.map(t => t.id === id ? { ...t, ...teacherData } : t));
  };

  const deleteTeacher = (id) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  return { teachers, addTeacher, updateTeacher, deleteTeacher };
};