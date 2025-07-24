import { StyleSheet, Platform, Pressable, Text, Alert } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { getUploadUrl, updateProfilePicture } from '../../api/api';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { useUser } from '@/context/user-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import type { ImagePickerAsset } from 'expo-image-picker';


interface UserInfo {
    username: string;
}

const screenWidth = Dimensions.get('window').width;

export default function TabTwoScreen() {
    const screenWidth = Dimensions.get('window').width;
    const { user, loading } = useUser();
    const [image, setImage] = useState<ImagePickerAsset | null>(null);
    const { refetchUser } = useUser();
    const logout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('../../login');
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow photo access.');
            return;
        }

  

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8
        });


        if (!result.canceled) {
            const original = result.assets[0];
            const compressed = await ImageManipulator.manipulateAsync(
                original.uri,
                [{ resize: { width: 200 } }],
                { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
            );
            const pickedImage = { ...original, uri: compressed.uri };
            setImage(pickedImage);
            return pickedImage;
            
        }
        return null;
    };

    const handleProfilePicUpload = async (img: ImagePickerAsset) => {
        if (!img) {
            Alert.alert('No image selected', 'Please choose an image.');
            return;
        }

        if (!user?.userId) {
            Alert.alert('Error', 'User ID missing.');
            return;
        }

        try {
            const { data } = await getUploadUrl('profile-pic');
            const { uploadUrl, imageUrl } = data;


            // ✅ Get file as blob
            const response = await fetch(img.uri);
            const blob = await response.blob();

            // ✅ Upload blob to S3
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'image/jpeg'
                },
                body: blob
            });

            if (!uploadRes.ok) {
                const text = await uploadRes.text();
                throw new Error(`Failed to upload to S3: ${uploadRes.status} - ${text}`);
            }
            
            await updateProfilePicture(imageUrl);
            Alert.alert('Profile picture updated!');
            setImage(null);
        }
        catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to upload profile picture.');
        }
    };

    if (loading) return <ThemedText style={{ color: 'white' }}>Loading...</ThemedText>;
    return (
        <ParallaxScrollView>
            <ThemedView style={styles.profileContainer}>
                <Pressable onPress={async () => {
                    const picked = await pickImage();
                  

                    if (picked) {
                        await handleProfilePicUpload(picked);
                    } else {
                        console.log('No image picked.');
                    }

                    refetchUser();
                }}>
                    {user?.profilePicture ? (
                        <Image
                        source={{ uri: user?.profilePicture }}
                        style={{ width: 98, height: 98, borderRadius: 49 }}
                        />
                    ) : (
                        <Ionicons name="add-circle" size={98} color="#D9D9D9" style={{ marginLeft: screenWidth * -0.03 }}></Ionicons>
                    )}
                </Pressable>
                <ThemedView style={styles.unContainer}>
                    <ThemedText type="subtitle">{user?.username}</ThemedText>
                    <ThemedText type="greyed">{user?.title} (edit)</ThemedText>

                </ThemedView>
                <Pressable style={styles.settingsButton} onPress={() => router.push('/(tabs)/profile/settings')} >
                    <Ionicons name="cog" size={38} color="#D9D9D9"></Ionicons>
                </Pressable>

            </ThemedView>

            <ThemedText>Gender: {user?.gender}</ThemedText>
            <ThemedText>Weight: {user?.weight}</ThemedText>
            <ThemedText>Bench PR: {user?.personalRecords.bench}</ThemedText>
            <ThemedText>Squat PR: {user?.personalRecords.squat}</ThemedText>
            <ThemedText>Deadlift PR: {user?.personalRecords.deadlift}</ThemedText>
            <ThemedText>Rank: {user?.DOTSrank}</ThemedText>
            <Pressable onPress={logout}>
                <ThemedText>Logout</ThemedText>
            </Pressable>


        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    settingsButton: {
        paddingTop: screenWidth * 0.04,
        marginLeft: 'auto',
    },
    unContainer: {
        paddingTop: 20,
        paddingLeft: 25,
        flexDirection: 'column',
        gap: 1,
    },
    profileContainer: {
        flexDirection: 'row',
        gap: 1,
    }
});
