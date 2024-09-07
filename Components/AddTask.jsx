import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/Config";
import { Picker } from "@react-native-picker/picker";

const AddTask = ({ userId }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskCategory, setNewTaskCategory] = useState("personal");

  const addTask = async () => {
    if (!newTaskTitle || !newTaskDescription) {
      Alert.alert("Error", "Please enter both title and description.");
      return;
    }

    try {
      const tasksRef = collection(db, "users", userId, "tasks");
      await addDoc(tasksRef, {
        title: newTaskTitle,
        description: newTaskDescription,
        due_date: new Date(),
        priority: newTaskPriority,
        category: newTaskCategory,
        status: "pending",
      });

      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("medium");
      setNewTaskCategory("personal");
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("Error", "Failed to add task. Please try again.");
    }
  };

  return (
    <View style={styles.addTaskSection}>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={newTaskTitle}
        onChangeText={setNewTaskTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Task Description"
        value={newTaskDescription}
        onChangeText={setNewTaskDescription}
      />
      <Picker
        selectedValue={newTaskCategory}
        style={styles.picker}
        onValueChange={(itemValue) => setNewTaskCategory(itemValue)}
      >
        <Picker.Item label="Personal" value="personal" />
        <Picker.Item label="Work" value="work" />
      </Picker>
      <Picker
        selectedValue={newTaskPriority}
        style={styles.picker}
        onValueChange={(itemValue) => setNewTaskPriority(itemValue)}
      >
        <Picker.Item label="Low" value="low" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="High" value="high" />
      </Picker>
      <TouchableOpacity onPress={addTask} style={styles.button}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addTaskSection: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddTask;
