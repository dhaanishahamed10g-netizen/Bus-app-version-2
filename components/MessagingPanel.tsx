import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Send, MessageSquare, Users, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  type: 'announcement' | 'alert' | 'info';
  busId: string;
}

export default function MessagingPanel() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageType, setMessageType] = useState<'announcement' | 'alert' | 'info'>('announcement');
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) return;

    // Initialize Socket.IO connection
    const newSocket = io('ws://localhost:3001', {
      auth: {
        token: 'mock-jwt-token',
        userId: user.id,
        role: user.role,
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to messaging service');
    });

    newSocket.on('newMessage', (messageData: Message) => {
      setMessages(prev => [messageData, ...prev]);
    });

    newSocket.on('messageDelivered', (data) => {
      Alert.alert('Message Sent', `Your message was delivered to ${data.recipientCount} passengers`);
    });

    setSocket(newSocket);

    // Load recent messages
    loadRecentMessages();

    return () => {
      newSocket.close();
    };
  }, [user]);

  const loadRecentMessages = () => {
    // Mock recent messages
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Approaching next stop in 3 minutes',
        sender: 'Mike Johnson',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'announcement',
        busId: 'A-101',
      },
      {
        id: '2',
        content: 'Please have your student ID ready for verification',
        sender: 'Sarah Wilson',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        type: 'info',
        busId: 'B-102',
      },
    ];
    setMessages(mockMessages);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !socket) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    const messageData = {
      content: message.trim(),
      type: messageType,
      busId: user?.role === 'driver' ? 'A-101' : undefined, // In real app, get from driver's assigned bus
      routeId: 'route-a', // In real app, get from current route
    };

    socket.emit('sendMessage', messageData);
    setMessage('');
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={16} color="#EF4444" />;
      case 'announcement': return <MessageSquare size={16} color="#4F46E5" />;
      case 'info': return <Users size={16} color="#059669" />;
      default: return <MessageSquare size={16} color="#6B7280" />;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'alert': return '#FEF2F2';
      case 'announcement': return '#EEF2FF';
      case 'info': return '#F0FDF4';
      default: return '#F9FAFB';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const messageTypes = [
    { key: 'announcement', label: 'Announcement', icon: MessageSquare },
    { key: 'alert', label: 'Alert', icon: AlertTriangle },
    { key: 'info', label: 'Info', icon: Users },
  ];

  if (!user || user.role !== 'driver') {
    return (
      <View style={styles.container}>
        <Text style={styles.accessDenied}>This feature is for drivers only.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Passenger Messaging</Text>
        <Text style={styles.subtitle}>Communicate with passengers on your route</Text>
      </View>

      <ScrollView style={styles.messagesList}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyMessage}>Start communicating with your passengers</Text>
          </View>
        ) : (
          messages.map((msg) => (
            <View key={msg.id} style={[
              styles.messageCard,
              { backgroundColor: getMessageColor(msg.type) }
            ]}>
              <View style={styles.messageHeader}>
                <View style={styles.messageInfo}>
                  {getMessageIcon(msg.type)}
                  <Text style={styles.messageType}>{msg.type.toUpperCase()}</Text>
                </View>
                <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
              </View>
              <Text style={styles.messageContent}>{msg.content}</Text>
              <Text style={styles.messageSender}>Sent by {msg.sender}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.messageComposer}>
        <View style={styles.typeSelector}>
          {messageTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.typeButton,
                messageType === type.key && styles.activeType
              ]}
              onPress={() => setMessageType(type.key as any)}
            >
              <type.icon size={16} color={messageType === type.key ? 'white' : '#6B7280'} />
              <Text style={[
                styles.typeText,
                messageType === type.key && styles.activeTypeText
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message to passengers..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={200}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.characterCount}>
          {message.length}/200 characters
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  accessDenied: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 50,
  },
  header: {
    backgroundColor: '#059669',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messagesList: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  messageCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageContent: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  messageComposer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  activeType: {
    backgroundColor: '#059669',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
  activeTypeText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    backgroundColor: '#059669',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
});