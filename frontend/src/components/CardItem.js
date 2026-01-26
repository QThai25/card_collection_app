// CardItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

const CardItem = ({ card, onPress, onAdd }) => {
  const imageSource =
    card?.imageUrl ||
    card?.image ||
    'https://via.placeholder.com/150?text=No+Image';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress} // Bấm vào thẻ là mở detail
      style={{
        width: 160,
        height: 230,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 3,
        padding: 10,
        alignItems: 'center',
      }}
    >
      <Image
        source={{ uri: imageSource }}
        style={{ width: 100, height: 150, borderRadius: 8 }}
        resizeMode="cover"
      />
      <Text
        style={{
          marginTop: 8,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {card.title}
      </Text>

      {/* Thêm nút nếu cần */}
      {onAdd && (
        <Button
          mode="contained"
          buttonColor="#4CAF50"
          textColor="white"
          onPress={(e) => {
            e.stopPropagation(); // tránh kích hoạt onPress mở detail
            onAdd();
          }}
          style={{ marginTop: 8, width: '80%' }}
        >
          Thêm
        </Button>
      )}
    </TouchableOpacity>
  );
};

export default CardItem;
