import { useState } from 'react';

export const useStudents = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      nome: 'João Silva',
      matricula: 'ENG001',
      curso: 'Engenharia de Software',
      email: 'joao@example.com',
      telefone: '11999999999',
      cep: '13860-000',
      endereco: 'Rua A, 123',
      cidade: 'Jacareí',
      estado: 'SP',
    },
    {
      id: 2,
      nome: 'Maria Santos',
      matricula: 'ENG002',
      curso: 'Engenharia de Software',
      email: 'maria@example.com',
      telefone: '11988888888',
      cep: '13860-100',
      endereco: 'Rua B, 456',
      cidade: 'Jacareí',
      estado: 'SP',
    },
  ]);

  const addStudent = (studentData) => {
    const newStudent = {
      id: students.length + 1,
      ...studentData,
    };
    setStudents([...students, newStudent]);
    return newStudent;
  };

  const updateStudent = (id, studentData) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...studentData } : s));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return { students, addStudent, updateStudent, deleteStudent };
};