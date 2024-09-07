import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/Config";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedPriority, setUpdatedPriority] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided");
      return;
    }

    const fetchTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(`tasks_${userId}`);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        } else {
          console.log("No tasks found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching tasks from AsyncStorage:", error);
      }
    };

    fetchTasks();

    console.log("Fetching tasks for user:", userId);
    const tasksRef = collection(db, "users", userId, "tasks");
    const q = query(tasksRef, where("due_date", ">=", new Date()));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched tasks:", tasksList);
        setTasks(tasksList);

        AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify(tasksList));
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const handleUpdateTask = async (id, updatedData) => {
    try {
      const taskRef = doc(db, "users", userId, "tasks", id);
      await updateDoc(taskRef, updatedData);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, ...updatedData } : task
        )
      );
      AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task.");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const taskRef = doc(db, "users", userId, "tasks", id);
      await deleteDoc(taskRef);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      AsyncStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  };
  useEffect(() => {
    console.log("Tasks:", tasks);
  }, [tasks]);

  const openUpdateModal = (task) => {
    setCurrentTask(task);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description);
    setUpdatedPriority(task.priority);
    setUpdatedCategory(task.category);
    setIsModalVisible(true);
  };

  const saveUpdatedTask = () => {
    handleUpdateTask(currentTask.id, {
      title: updatedTitle,
      description: updatedDescription,
      priority: updatedPriority,
      category: updatedCategory,
    });
    setIsModalVisible(false);
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Due: {item.due_date?.toDate().toLocaleDateString()}</Text>
      <Text>Priority: {item.priority}</Text>
      <Text>Category: {item.category}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            handleUpdateTask(item.id, {
              status: item.status === "completed" ? "pending" : "completed",
            })
          }
          style={[
            styles.statusButton,
            item.status === "completed"
              ? styles.doneButton
              : styles.notDoneButton,
          ]}
        >
          <Text style={styles.statusButtonText}>
            {item.status === "completed" ? "Done" : "Not Done"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openUpdateModal(item)}
          style={styles.updateButton}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteTask(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={updatedTitle}
            onChangeText={setUpdatedTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={updatedDescription}
            onChangeText={setUpdatedDescription}
          />
          <Picker
            selectedValue={updatedPriority}
            style={styles.picker}
            onValueChange={(itemValue) => setUpdatedPriority(itemValue)}
          >
            <Picker.Item label="High" value="High" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Low" value="Low" />
          </Picker>
          <Picker
            selectedValue={updatedCategory}
            style={styles.picker}
            onValueChange={(itemValue) => setUpdatedCategory(itemValue)}
          >
            <Picker.Item label="Work" value="Work" />
            <Picker.Item label="Personal" value="Personal" />
            <Picker.Item label="Urgent" value="Urgent" />
          </Picker>
          <Button title="Save" onPress={saveUpdatedTask} />
          <Button
            title="Cancel"
            onPress={() => setIsModalVisible(false)}
            color="red"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  taskContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusButton: {
    padding: 5,
    borderRadius: 5,
  },
  doneButton: {
    backgroundColor: "green",
  },
  notDoneButton: {
    backgroundColor: "red",
  },
  statusButtonText: {
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "darkred",
    padding: 5,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: "darkblue",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    padding: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  taskList: {
    flex: 1,
  },
});

export default TaskList;
