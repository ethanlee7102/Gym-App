import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://192.168.1.223:3000'; 

export const register = (username, password) =>
    axios.post(`${API_BASE}/register`, {username, password});

export const login = (username, password) =>
    axios.post(`${API_BASE}/login`, {username, password});

export const getMe = async () => { 
    const token = await AsyncStorage.getItem('token');
    return axios.get(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
};

export const sendFriendRequest = async (targetUsername) => {
    const token = await AsyncStorage.getItem('token');
    return axios.post(`${API_BASE}/friends/request`, { username: targetUsername }, {
      headers: { Authorization: `Bearer ${token}` }
    });
};

export const acceptFriendRequest = async (requesterUsername) => {
    const token = await AsyncStorage.getItem('token');
    return axios.post(`${API_BASE}/friends/accept`, { username: requesterUsername }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getFriendRequests = async () => {
    const token = await AsyncStorage.getItem('token');
    return axios.get(`${API_BASE}/friends/requests`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getSentFriendRequests = async () => {
    const token = await AsyncStorage.getItem('token');
    return axios.get(`${API_BASE}/friends/sentRequests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
};

export const getUploadUrl = async (type) => {
    const token = await AsyncStorage.getItem('token');
    return axios.get(`${API_BASE}/api/upload-url`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { type }
    });
};
  

export const createPost = async (caption, imageUrl, userId) => {
    const token = await AsyncStorage.getItem('token');
    return axios.post(`${API_BASE}/api/posts`, {
        caption,
        imageUrl,
        userId
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getFeed = async (page = 1, limit = 10) => {
    const token = await AsyncStorage.getItem('token');
    return axios.get(`${API_BASE}/feed`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
    });
};

export const submitQuiz = async (quizData) => {
    const token = await AsyncStorage.getItem('token');
    return axios.post( `${API_BASE}/quiz/submit`, quizData,{
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const updateProfilePicture = async (imageUrl) => {
    const token = await AsyncStorage.getItem('token');
    return axios.post(`${API_BASE}/api/profile-picture`, 
        { imageUrl },
        {
        headers: { Authorization: `Bearer ${token}` }
        
    });
};

export const checkIn = async () => {
    const token = await AsyncStorage.getItem('token');
    return axios.post( `${API_BASE}/checkin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getStreakLeaderboard = async () => {
    return axios.get(`${API_BASE}/leaderboard/streaks`);
};