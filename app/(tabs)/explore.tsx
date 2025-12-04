import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function Explore() {
  const { role } = useLocalSearchParams();
  const isManager = role === "manager";

  const [products, setProducts] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDesc, setEditDesc] = useState("");

  async function loadProducts() {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
      return;
    }
    setProducts(data || []);
  }

  async function addProduct() {
    if (!isManager) return;

    if (!name.trim() || !price.trim() || !desc.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    const { error } = await supabase.from("products").insert({
      title: name,
      price: Number(price),
      description: desc,
    });

    if (error) {
      Alert.alert("Erro", "Não foi possível adicionar.");
      return;
    }

    setName("");
    setPrice("");
    setDesc("");
    loadProducts();
  }

  async function deleteProduct(id: number) {
    if (!isManager) return;
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  async function saveEdit(id: number) {
    if (!editName.trim() || !editPrice.trim() || !editDesc.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    await supabase
      .from("products")
      .update({
        title: editName,
        price: Number(editPrice),
        description: editDesc,
      })
      .eq("id", id);

    setEditingId(null);
    setEditName("");
    setEditPrice("");
    setEditDesc("");
    loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/")}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        {isManager ? "Gestor - Produtos" : "Cliente - Produtos"}
      </Text>

      {isManager && (
        <View style={styles.formBox}>
          <Text style={styles.sectionTitle}>Adicionar produto</Text>

          <TextInput
            placeholder="Nome"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Preço"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            placeholder="Descrição"
            value={desc}
            onChangeText={setDesc}
            style={styles.input}
          />

          <TouchableOpacity style={styles.btn} onPress={addProduct}>
            <Text style={styles.btnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Produtos cadastrados:</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {editingId === item.id ? (
              <>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Novo nome"
                  style={styles.input}
                />

                <TextInput
                  value={editPrice}
                  onChangeText={setEditPrice}
                  placeholder="Novo preço"
                  keyboardType="numeric"
                  style={styles.input}
                />

                <TextInput
                  value={editDesc}
                  onChangeText={setEditDesc}
                  placeholder="Nova descrição"
                  style={styles.input}
                />

                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => saveEdit(item.id)}
                >
                  <Text style={styles.btnText}>Salvar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardText}>Preço: R$ {item.price}</Text>
                <Text style={styles.cardText}>Descrição: {item.description}</Text>

                {isManager && (
                  <>
                    <TouchableOpacity
                      style={styles.smallBtn}
                      onPress={() => {
                        setEditingId(item.id);
                        setEditName(item.title);
                        setEditPrice(String(item.price));
                        setEditDesc(item.description);
                      }}
                    >
                      <Text style={styles.smallBtnText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.smallBtn, { backgroundColor: "#ff4444" }]}
                      onPress={() => deleteProduct(item.id)}
                    >
                      <Text style={styles.smallBtnText}>Excluir</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e6f0ff",
  },
  backBtn: {
    backgroundColor: "#3366ff",
    padding: 10,
    borderRadius: 10,
    width: 120,
    marginBottom: 15,
  },
  backText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    color: "#003366",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#003366",
  },
  formBox: {
    marginBottom: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#99b3ff",
  },
  btn: {
    backgroundColor: "#3366ff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
  },
  cardText: {
    marginBottom: 5,
  },
  smallBtn: {
    backgroundColor: "#3366ff",
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
    alignItems: "center",
  },
  smallBtnText: {
    color: "white",
    fontWeight: "bold",
  },
});
