<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div id="container">
                <ion-text class="title">
                    <h1>Login</h1>
                </ion-text>
                <ion-text class="subtitle">
                    <p>Masuk untuk melanjutkan</p>
                </ion-text>
                <ion-button expand="block" @click="login" color="primary">
                    <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
                    <ion-label>Masuk dengan Google</ion-label>
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonButton, IonIcon, IonText, IonLabel } from '@ionic/vue';
import { logoGoogle } from 'ionicons/icons';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const login = async () => {
    await authStore.loginWithGoogle();
};
</script>

<style>
#container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 20px;
    text-align: center;
}

.title h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
}

.subtitle p {
    font-size: 16px;
    color: #6b6b6b;
    margin-bottom: 20px;
}

ion-button {
    --border-radius: 8px;
    --padding-start: 12px;
    --padding-end: 12px;
    --background: #4285F4;
    --background-activated: #357ae8;
    --background-hover: #5a95f5;
}
</style>
