import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";

const ChatsPage = ({ navigation }) => {
  const currentUserUid = auth.currentUser.uid;
  const [chatMessages, setChatMessages] = useState([]);

  let messages1 = [];
  const fetchChatMessages = async () => {
    console.log(currentUserUid);
    const chatsCollection = collection(db, "chats");
    const chatMessagesQuery1 = query(
      chatsCollection,
      where("job_finder", "==", currentUserUid)
    );

    const chatMessagesQuery2 = query(
      chatsCollection,
      where("post_owner", "==", currentUserUid)
    );

    const senderSnapshot = await getDocs(chatMessagesQuery1);
    const recipientSnapshot = await getDocs(chatMessagesQuery2);

    const chatMessagesData = [
      ...senderSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      ...recipientSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
    ];

    let listData = [];
    chatMessagesData.map((doc) => {
      const chat = doc.chats[doc.chats.length - 1];
      listData.push({ ...doc, ...chat });
    });

    messages1 = chatMessagesData[0].chats;
    setChatMessages(listData);
    console.log(messages1);
  };

  useEffect(() => {
    fetchChatMessages();
  }, [currentUserUid]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchChatMessages();
    });

    return unsubscribe;
  }, [navigation]);

  const goChat = (item) => {
    console.log(item);
    const receiverId =
      item.senderUid === currentUserUid ? item.recipientUid : item.senderUid;
    navigation.navigate("ChatRoom", {
      roomId: item.id,
      receiverId: receiverId,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.chatMessageContainer}>
      <TouchableOpacity onPress={() => goChat(item)}>
        <Text style={styles.chatMessage}>{item.message}</Text>
        <Text style={styles.chatMessageMeta}>
          {item.senderUid === currentUserUid ? "You" : "Them"} ·{" "}
          {item.created.toDate().toLocaleString()}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.created}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chatMessageContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  chatMessage: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chatMessageMeta: {
    fontSize: 12,
    color: "#999",
  },
});

export default ChatsPage;
