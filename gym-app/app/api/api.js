import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://192.168.1.25:3000'; 

export const register = (username, password) =>
    axios.post(`${API_BASE}/register`, {username, password});

export const login = (username, password) =>
    axios.post(`${API_BASE}/login`, {username, password});