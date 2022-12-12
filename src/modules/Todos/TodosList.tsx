import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../../../App';
import { todoCollectionName } from '../../store/database/InitializeDatabase';
import styles from './styles';

const TodoList = () => {
  const { db } = useContext(AppContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todoList, setTodoList] = useState<any>([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const deleteIcon =
    'https://img.icons8.com/external-creatype-outline-colourcreatype/512/external-app-web-application-2-creatype-outline-colourcreatype-20.png';
  const pencilIcon = 'https://img.icons8.com/ios-glyphs/512/pencil.png';

  useEffect(() => {
    const fetchTodos = async () => {
      if (db[todoCollectionName]) {
        await db[todoCollectionName].find().$.subscribe((todo: any) => {
          setTodoList(todo);
        });
      } else {
        return;
      }
    };
    fetchTodos();
  }, [db]);

  const addTodo = async () => {
    if (db[todoCollectionName]) {
      const todos = {
        id: `${Date.now()}`,
        title,
        description,
        done: false,
      };
      await db[todoCollectionName].insert(todos);
      setTodoList([...todoList, todos]);
      setTitle('');
      setDescription('');
    }
  };

  const updateTodo = async () => {
    const todo = {
      id: selectedTodo?.id,
      title,
      description,
      done: false,
    };
    await db[todoCollectionName].upsert(todo);
    setSelectedTodo(null);
    setTitle('');
    setDescription('');
  };

  const selectTodo = todo => {
    setSelectedTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const removeTodo = async (todos: any) => {
    Alert.alert(
      'Delete Todo?',
      `Are you sure you want to delete '${todos.title}'`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          style: 'destructive',
          onPress: async () => {
            const doc = db[todoCollectionName].findOne({
              selector: {
                id: todos.id,
                title: todos.title,
                description: todos.description,
              },
            });
            await doc.remove();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.topContainer}>
      <Text style={styles.todoStyle}>{'TODO LIST'}</Text>
      <ScrollView style={styles.todoList}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={name => setTitle(name)}
            placeholder="Title"
          />
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={des => setDescription(des)}
            placeholder="Description"
          />
          <TouchableOpacity
            style={styles.plusImage}
            disabled={!title}
            onPress={() => {
              !selectedTodo ? addTodo() : updateTodo();
            }}>
            <Text style={styles.buttonText}>
              {!selectedTodo ? 'Add Todo' : 'Update Todo'}
            </Text>
          </TouchableOpacity>
        </View>
        {todoList.length === 0 && (
          <>
            <Text style={styles.noTodoStyle}>{'No Todo Items'}</Text>
            <Text style={styles.noTodoStyle}>{'Add one to create'}</Text>
          </>
        )}
        {todoList.map((item: any, index: number) => (
          <View style={styles.cardTodo} key={index}>
            <View>
              <Text style={styles.todoName}>{item.title}</Text>
              <Text style={styles.descStyle}>{item.description}</Text>
            </View>
            <View style={styles.alignRight}>
              <TouchableOpacity onPress={() => selectTodo(item)}>
                <Image
                  style={styles.deleteImage}
                  source={{
                    uri: pencilIcon,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeTodo(item)}>
                <Image
                  style={styles.deleteImage}
                  source={{
                    uri: deleteIcon,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TodoList;
