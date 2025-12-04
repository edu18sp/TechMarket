import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";

export default function Index() {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");

  function handleClient() {
    router.push("/explore?role=client");
  }

  function handleManager() {
    setShowPasswordInput(true);
  }

  function showAlert(msg: string) {
    if (Platform.OS === "web") {
      window.alert(msg);
    } else {
      import("react-native").then(({ Alert }) => {
        Alert.alert("Erro", msg);
      });
    }
  }

  function confirmPassword() {
    if (password.trim() === "1234") {
      router.push("/explore?role=manager");
    } else {
      showAlert("Senha incorreta!");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione o tipo de acesso</Text>

      <TouchableOpacity style={styles.btn} onPress={handleClient}>
        <Text style={styles.btnText}>Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleManager}>
        <Text style={styles.btnText}>Gestor</Text>
      </TouchableOpacity>

      {showPasswordInput && (
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Senha do gestor"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity style={styles.btn} onPress={confirmPassword}>
            <Text style={styles.btnText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: "#e6f0ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
  },
  btn: {
    backgroundColor: "#3366ff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    elevation: 3,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputBox: {
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#99b3ff",
    padding: 10,
    marginBottom: 15,
  },
});
