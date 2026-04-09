import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { useSubjects } from '../hooks/useSubjects';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../styles/globalStyles';

const SubjectRegistrationScreen = ({ navigation }) => {
  const { subjects, addSubject } = useSubjects();
  const { logout } = useAuth();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cargaHoraria: '',
    professorResponsavel: '',
    curso: '',
    semestre: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome da disciplina é obrigatório';
    if (!formData.cargaHoraria.trim()) newErrors.cargaHoraria = 'Carga horária é obrigatória';
    if (!formData.professorResponsavel.trim()) newErrors.professorResponsavel = 'Professor responsável é obrigatório';
    if (!formData.curso.trim()) newErrors.curso = 'Curso é obrigatório';
    if (!formData.semestre.trim()) newErrors.semestre = 'Semestre é obrigatório';
    return newErrors;
  };

  const handleAddSubject = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      Alert.alert('Validação', 'Por favor, corrija os erros');
      return;
    }

    addSubject(formData);
    setFormData({
      nome: '',
      cargaHoraria: '',
      professorResponsavel: '',
      curso: '',
      semestre: '',
    });
    setErrors({});
    setIsFormVisible(false);
    Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!');
  };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderSubjectCard = ({ item }) => (
    <Card key={item.id} style={styles.subjectCard}>
      <Text style={styles.subjectName}>{item.nome}</Text>
      <View style={styles.subjectInfo}>
        <Text style={styles.infoLabel}>Carga Horária: </Text>
        <Text style={styles.infoValue}>{item.cargaHoraria}</Text>
      </View>
      <View style={styles.subjectInfo}>
        <Text style={styles.infoLabel}>Professor: </Text>
        <Text style={styles.infoValue}>{item.professorResponsavel}</Text>
      </View>
      <View style={styles.subjectInfo}>
        <Text style={styles.infoLabel}>Curso: </Text>
        <Text style={styles.infoValue}>{item.curso}</Text>
      </View>
      <View style={styles.subjectInfo}>
        <Text style={styles.infoLabel}>Semestre: </Text>
        <Text style={styles.infoValue}>{item.semestre}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Cadastro de Disciplinas" 
        onLogout={handleLogout}
        showLogout={true}
      />

      <ScrollView style={styles.scrollView}>
        {!isFormVisible ? (
          <>
            <View style={styles.headerSection}>
              <Text style={styles.totalText}>
                Total de disciplinas: {subjects.length}
              </Text>
              <Button
                title="+ Nova Disciplina"
                onPress={() => setIsFormVisible(true)}
                variant="primary"
                size="medium"
              />
            </View>

            {subjects.length > 0 ? (
              <FlatList
                data={subjects}
                renderItem={renderSubjectCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>Nenhuma disciplina cadastrada</Text>
              </Card>
            )}
          </>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Nova Disciplina</Text>

            <Input
              label="Nome da Disciplina"
              value={formData.nome}
              onChangeText={(text) => setFormData({ ...formData, nome: text })}
              placeholder="Programação I"
              error={errors.nome}
            />

            <Input
              label="Carga Horária"
              value={formData.cargaHoraria}
              onChangeText={(text) => setFormData({ ...formData, cargaHoraria: text })}
              placeholder="60 horas"
              error={errors.cargaHoraria}
            />

            <Input
              label="Professor Responsável"
              value={formData.professorResponsavel}
              onChangeText={(text) => setFormData({ ...formData, professorResponsavel: text })}
              placeholder="Dr. Carlos Ferreira"
              error={errors.professorResponsavel}
            />

            <Input
              label="Curso"
              value={formData.curso}
              onChangeText={(text) => setFormData({ ...formData, curso: text })}
              placeholder="Engenharia de Software"
              error={errors.curso}
            />

            <Input
              label="Semestre"
              value={formData.semestre}
              onChangeText={(text) => setFormData({ ...formData, semestre: text })}
              placeholder="1º Semestre"
              error={errors.semestre}
            />

            <View style={styles.formButtons}>
              <Button
                title="Salvar"
                onPress={handleAddSubject}
                variant="success"
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <Button
                title="Cancelar"
                onPress={() => {
                  setIsFormVisible(false);
                  setFormData({
                    nome: '',
                    cargaHoraria: '',
                    professorResponsavel: '',
                    curso: '',
                    semestre: '',
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
  subjectCard: {
    marginBottom: Spacing.md,
  },
  subjectName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  subjectInfo: {
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

export default SubjectRegistrationScreen;