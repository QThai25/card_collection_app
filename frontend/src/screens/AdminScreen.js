// AdminScreen.js: Màn hình admin cho CRUD cards.
// Sửa lỗi: Thêm import Text từ react-native.

import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/axiosInstance';
import { useAuth } from '../auth/AuthContext';
import Toast from 'react-native-toast-message';

const AdminScreen = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rarity, setRarity] = useState('');
  const [code, setCode] = useState('');
  const [image, setImage] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api.get('/cards')
      .then(res => {
        setCards(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('rarity', rarity);
    formData.append('code', code);
    if (image) {
      formData.append('image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }
    try {
      const res = await api.post('/cards', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCards([...cards, res.data]);
      Toast.show({ type: 'success', text1: 'Đã tạo card' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Lỗi tạo' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/cards/${id}`);
      setCards(cards.filter(c => c._id !== id));
      Toast.show({ type: 'success', text1: 'Đã xóa' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Lỗi xóa' });
    }
  };

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput label="Title" value={title} onChangeText={setTitle} />
      <TextInput label="Description" value={description} onChangeText={setDescription} />
      <TextInput label="Rarity" value={rarity} onChangeText={setRarity} />
      <TextInput label="Code" value={code} onChangeText={setCode} />
      <Button onPress={pickImage}>Chọn ảnh</Button>
      <Button mode="contained" onPress={handleCreate}>Tạo card</Button>
      <FlatList
        data={cards}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{item.title}</Text>
            <Button onPress={() => handleDelete(item._id)}>Xóa</Button>
          </View>
        )}
      />
    </View>
  );
};

export default AdminScreen;