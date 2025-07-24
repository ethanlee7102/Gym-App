import { StyleSheet, Image, Platform, View, TextInput, Button, Alert } from 'react-native';
import React, { useState, useContext } from 'react';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';
import { getUploadUrl, createPost } from '../../api/api';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import * as ImageManipulator from 'expo-image-manipulator';

import { useUser } from '@/context/user-context';

global.Buffer = global.Buffer || Buffer;

export default function AddPostScreen() {
    const { user } = useUser();
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<ImagePickerAsset | null>(null);
    const [uploading, setUploading] = useState(false);


    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow photo access.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 1
        });


        if (!result.canceled) {
            const original = result.assets[0];
            const compressed = await ImageManipulator.manipulateAsync(
                original.uri,
                [{ resize: { width: 1080 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
            
            setImage({ ...original, uri: compressed.uri, });
        }
    };

    const pickFromCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow camera access.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const original = result.assets[0];
            const compressed = await ImageManipulator.manipulateAsync(
                original.uri,
                [{ resize: { width: 1080 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );

            setImage({ ...original, uri: compressed.uri, });
        }
    };

    const compressImage = async (uri: string) => {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 1080 } }],
            {
                compress: 0.7,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );
        return result.uri;
    };



    const handlePost = async () => {
        if (!image) {
            Alert.alert('No image selected', 'Please choose an image to post.');
            return;
        }

        if (!user?.userId) {
            Alert.alert('Error', 'User ID missing.');
            return;
        }
        setUploading(true);
        try {
            const { data } = await getUploadUrl('posts');
            const { uploadUrl, imageUrl } = data;


            // ✅ Get file as blob
            const response = await fetch(image.uri);
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
            // if (!uploadRes.ok) throw new Error('Failed to upload to S3');

            await createPost(caption, imageUrl, user.userId);
            Alert.alert('Post uploaded!');
            setCaption('');
            setImage(null);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Post upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <ParallaxScrollView>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Post</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <Button title="Pick an image" onPress={pickImage} />
                <Button title="Take a photo" onPress={pickFromCamera} />
                {image && <Image source={{ uri: image.uri }} style={styles.image} />}
                <TextInput
                    placeholder="Enter caption"
                    value={caption}
                    onChangeText={setCaption}
                    style={[styles.input, styles.textInput]}
                />
                <Button title="Post" onPress={handlePost} disabled={uploading} />
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingTop: 10,
    },
    container: {
        flex: 1,
        padding: 16
    },
    image: {
        width: '100%',
        height: 200,
        marginVertical: 10
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10
    },
    textInput: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'System',
    }
});