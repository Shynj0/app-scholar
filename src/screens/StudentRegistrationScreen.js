import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { useStudents } from '../hooks/useStudents';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../styles/globalStyles';

const StudentRegistrationScreen = ({ navigation }) => {
  const { students, addStudent } = useStudents();
  const { logout } = useAuth();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    curso: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.matricula.trim()) newErrors.matricula = 'Matrícula é obrigatória';
    if (!formData.curso.trim()) newErrors.curso = 'Curso é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    return newErrors;
  };

  const handleAddStudent = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      Alert.alert('Validação', 'Por favor, corrija os erros');
      return;
    }

    addStudent(formData);
    setFormData({
      nome: '',
      matricula: '',
      curso: '',
      email: '',
      telefone: '',
      cep: '',
      endereco: '',
      cidade: '',
      estado: '',
    });
    setErrors({});
    setIsFormVisible(false);
    Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
  };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderStudentCard = ({ item }) => (
    <Card key={item.id} style={styles.studentCard}>
      <Text style={styles.studentName}>{item.nome}</Text>
      <View style={styles.studentInfo}>
        <Text style={styles.infoLabel}>Matrícula: </Text>
        <Text style={styles.infoValue}>{item.matricula}</Text>
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.infoLabel}>Curso: </Text>
        <Text style={styles.infoValue}>{item.curso}</Text>
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.infoLabel}>Email: </Text>
        <Text style={styles.infoValue}>{item.email}</Text>
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.infoLabel}>Telefone: </Text>
        <Text style={styles.infoValue}>{item.telefone}</Text>
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.infoLabel}>Cidade: </Text>
        <Text style={styles.infoValue}>{item.cidade}, {item.estado}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Cadastro de Alunos" 
        onLogout={handleLogout}
        showLogout={true}
      />

      <ScrollView style={styles.scrollView}>
        {!isFormVisible ? (
          <>
            <View style={styles.headerSection}>
              <Text style={styles.totalText}>
                Total de alunos: {students.length}
              </Text>
              <Button
                title="+ Novo Aluno"
                onPress={() => setIsFormVisible(true)}
                variant="primary"
                size="medium"
              />
            </View>

            {students.length > 0 ? (
              <FlatList
                data={students}
                renderItem={renderStudentCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
              </Card>
            )}
          </>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Novo Aluno</Text>

            <Input
              label="Nome Completo"
              value={formData.nome}
              onChangeText={(text) => setFormData({ ...formData, nome: text })}
              placeholder="João Silva"
              error={errors.nome}
            />

            <Input
              label="Matrícula"
              value={formData.matricula}
              onChangeText={(text) => setFormData({ ...formData, matricula: text })}
              placeholder="ENG001"
              error={errors.matricula}
            />

            <Input
              label="Curso"
              value={formData.curso}
              onChangeText={(text) => setFormData({ ...formData, curso: text })}
              placeholder="Engenharia de Software"
              error={errors.curso}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="joao@example.com"
              keyboardType="email-address"
              error={errors.email}
            />

            <Input
              label="Telefone"
              value={formData.telefone}
              onChangeText={(text) => setFormData({ ...formData, telefone: text })}
              placeholder="11999999999"
              keyboardType="phone-pad"
              error={errors.telefone}
            />

            <Input
              label="CEP"
              value={formData.cep}
              onChangeText={(text) => setFormData({ ...formData, cep: text })}
              placeholder="13860-000"
              error={errors.cep}
            />

            <Input
              label="Endereço"
              value={formData.endereco}
              onChangeText={(text) => setFormData({ ...formData, endereco: text })}
              placeholder="Rua A, 123"
              error={errors.endereco}
            />

            <Input
              label="Cidade"
              value={formData.cidade}
              onChangeText={(text) => setFormData({ ...formData, cidade: text })}
              placeholder="Jacareí"
              error={errors.cidade}
            />

            <Input
              label="Estado"
              value={formData.estado}
              onChangeText={(text) => setFormData({ ...formData, estado: text })}
              placeholder="SP"
              error={errors.estado}
            />

            <View style={styles.formButtons}>
              <Button
                title="Salvar"
                onPress={handleAddStudent}
                variant="success"
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <Button
                title="Cancelar"
                onPress={() => {
                  setIsFormVisible(false);
                  setFormData({
                    nome: '',
                    matricula: '',
                    curso: '',
                    email: '',
                    telefone: '',
                    cep: '',
                    endereco: '',
                    cidade: '',
                    estado: '',
                  });
                  setErrors({});
                }}
                variant="danger"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.md,
  },
  headerSection: {
    marginBottom: Spacing.lg,
  },
  totalText: {
    fontSize: FontSizes.base,
    color: Colors.text,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  studentCard: {
    marginBottom: Spacing.md,
  },
  studentName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  studentInfo: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    flex: 2,
  },
  formContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    marginBottom: Spacing.lg,
  },
  formTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
});

export default StudentRegistrationScreen;