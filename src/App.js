import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome';

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("repositories").then((response) => {
      setRepositories(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    if (response.status !== 400) {
      const repositoryResponse = response.data;

      const repositoriesUpdated = repositories.map((repository) =>
        repository.id === repositoryResponse.id
          ? repositoryResponse
          : repository
      );

      setRepositories(repositoriesUpdated);
    }
  }

  async function handleRemoveRepository(id){
    const response = await api.delete(`repositories/${id}`);

    if(response.status === 204){
      const filteredRepositores = repositories.filter(repository => repository.id !== id);

      setRepositories(filteredRepositores);
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />

      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <FlatList
                style={styles.techsContainer}
                data={repository.techs}
                keyExtractor={(tech) => tech}
                renderItem={({ item: tech }) => (
                  <Text style={styles.tech}>{tech}</Text>
                )}
              />

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {`${repository.likes} ${
                    repository.likes === 1 ? `curtida` : `curtidas`
                  }`}
                </Text>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  testID={`like-button-${repository.id}`}
                >
                  <Icon style={styles.buttonIcon} name="heart-o" size={20} color="#FFF"/>
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonRemove]}
                  onPress={() => handleRemoveRepository(repository.id)}
                >
                  <Icon style={styles.buttonIcon} name="trash-o" size={20} color="#FFF"/>
                  <Text style={styles.buttonText}>Remover</Text>
                </TouchableOpacity>
              </View>
              
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1"
  },
  repositoryContainer: {
    backgroundColor: "#fff",
    borderRadius: 4,
    marginBottom: 15,
    marginHorizontal: 15,
    padding: 20,
  },
  repository: {
    fontSize: 28,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    borderRadius: 4
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: "#7159c1",
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginRight: 10,
    borderRadius: 4
  },
  buttonRemove: {
    backgroundColor: "#DB113F",
  },
  buttonIcon: {
    paddingLeft: 4
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    padding: 10,
  },
});
