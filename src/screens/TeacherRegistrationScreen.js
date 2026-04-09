import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { useTeachers } from '../hooks/useTeachers';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../styles/globalStyles';

const TeacherRegistrationScreen = ({ navigation }) => {
  const { teachers, addTeacher } = useTeachers();
  const { logout } = useAuth();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    titulacao: '',
    areaAtuacao: '',
    tempoDocencia: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.titulacao.trim()) newErrors.titulacao = 'Titulação é obrigatória';
    if (!formData.areaAtuacao.trim()) newErrors.areaAtuacao = 'Área de atuação é obrigatória';
    if (!formData.tempoDocencia.trim()) newErrors.tempoDocencia = 'Tempo de docência é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    return newErrors;
  };

  const handleAddTeacher = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      Alert.alert('Validação', 'Por favor, corrija os erros');
      return;
    }

    addTeacher(formData);
    setFormData({
      nome: '',
      titulacao: '',
      areaAtuacao: '',
      tempoDocencia: '',
      email: '',
    });
    setErrors({});
    setIsFormVisible(false);
    Alert.alert('Sucesso', 'Professor cadastrado com sucesso!');
  };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderTeacherCard = ({ item }) => (
    <Card key={item.id} style={styles.teacherCard}>
      <Text style={styles.teacherName}>{item.nome}</Text>
      <View style={styles.teacherInfo}>
        <Text style={styles.infoLabel}>Titulação: </Text>
        <Text style={styles.infoValue}>{item.titulacao}</Text>
      </View>
      <View style={styles.teacherInfo}>
        <Text style={styles.infoLabel}>Área de Atuação: </Text>
        <Text style={styles.infoValue}>{item.areaAtuacao}</Text>
      </View>
      <View style={styles.teacherInfo}>
        <Text style={styles.infoLabel}>Tempo de Docência: </Text>
        <Text style={styles.infoValue}>{item.tempoDocencia}</Text>
      </View>
      <View style={styles.teacherInfo}>
        <Text style={styles.infoLabel}>Email: </Text>
        <Text style={styles.infoValue}>{item.email}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Cadastro de Professores" 
        onLogout={handleLogout}
        showLogout={true}
      />

      <ScrollView style={styles.scrollView}>
        {!isFormVisible ? (
          <>
            <View style={styles.headerSection}>
              <Text style={styles.totalText}>
                Total de professores: {teachers.length}
              </Text>
              <Button
                title="+ Novo Professor"
                onPress={() => setIsFormVisible(true)}
                variant="primary"
                size="medium"
              />
            </View>

            {teachers.length > 0 ? (
              <FlatList
                data={teachers}
                renderItem={renderTeacherCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>Nenhum professor cadastrado</Text>
              </Card>
            )}
          </>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Novo Professor</Text>

            <Input
              label="Nome Completo"
              value={formData.nome}
              onChangeText={(text) => setFormData({ ...formData, nome: text })}
              placeholder="Dr. Carlos Ferreira"
              error={errors.nome}
            />

            <Input
              label="Titulação"
              value={formData.titulacao}
              onChangeText={(text) => setFormData({ ...formData, titulacao: text })}
              placeholder="Doutorado, Mestrado, etc"
              error={errors.titulacao}
            />

            <Input
              label="Área de Atuação"
              value={formData.areaAtuacao}
              onChangeText={(text) => setFormData({ ...formData, areaAtuacao: text })}
              placeholder="Engenharia de Software"
              error={errors.areaAtuacao}
            />

            <Input
              label="Tempo de Docência"
              value={formData.tempoDocencia}
              onChangeText={(text) => setFormData({ ...formData, tempoDocencia: text })}
              placeholder="15 anos"
              error={errors.tempoDocencia}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="professor@example.com"
              keyboardType="email-address"
              error={errors.email}
            />

            <View style={styles.formButtons}>
              <Button
                title="Salvar"
                onPress={handleAddTeacher}
                variant="success"
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <Button
                title="Cancelar"
                onPress={() => {
                  setIsFormVisible(false);
                  setFormData({
                    nome: '',
                    titulacao: '',
                    areaAtuacao: '',
                    tempoDocencia: '',
                    email: '',
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
  teacherCard: {
    marginBottom: Spacing.md,
  },
  teacherName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  teacherInfo: {
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

export default TeacherRegistrationScreen;